import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string" || query.trim() === "") {
      return NextResponse.json({ error: "Invalid or empty search query" }, { status: 400 });
    }

    const ai = getAiClient();
    
    const systemInstruction = 
      "You are the Intelligent Knowledge Base and Search Engine for Electronics Gyan, a premier educational and technical platform for electronics, electrical engineering, embedded systems, microcontrollers (STM32, Arduino, ESP32, Raspberry Pi), IoT, PCB design, and mechanical systems.\n\n" +
      "Your task is to take the user's search query, retrieve high-quality, up-to-date information using your built-in Google Search grounding capability, and synthesize a comprehensive, professional, and technical explanation.\n\n" +
      "CRITICAL INSTRUCTIONS:\n" +
      "1. NATIVE INTEGRATION: Never use phrases like 'According to Google search', 'I found on the web', or 'Based on my search'. Present the information naturally, authoritatively, and seamlessly as if it is a built-in article or tutorial on Electronics Gyan.\n" +
      "2. STRUCTURED FORMATTING: Format your response beautifully in Markdown with logical headings (h2, h3), bullet points, clear tables (for pinouts or specifications), and code blocks with syntax highlighting (e.g., C/C++, Arduino, Python) where appropriate.\n" +
      "3. PRACTICAL DEPTH: Provide exact technical details, pin configurations, component specs, common applications, and circuit connection guides if the user asks about a component or pinout.\n" +
      "4. BE HELPFUL AND ENCOURAGING: Guide them through the principles of the component/technology in a way that is highly valuable for hardware developers, hobbyists, and students.";

    console.log(`Executing search grounding query: "${query}"`);

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Search query: ${query}`,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";

    // Extract grounding sources
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: { title: string; uri: string }[] = [];
    
    if (chunks && Array.isArray(chunks)) {
      for (const chunk of chunks) {
        if (chunk?.web?.uri) {
          sources.push({
            title: chunk.web.title || "Reference Manual",
            uri: chunk.web.uri,
          });
        }
      }
    }

    // Deduplicate sources by uri
    const uniqueSources = Array.from(
      new Map(sources.map((s) => [s.uri, s])).values()
    );

    return NextResponse.json({
      text,
      sources: uniqueSources,
    });
  } catch (error: any) {
    console.error("Search Grounding API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to search and aggregate information from the web." },
      { status: 500 }
    );
  }
}
