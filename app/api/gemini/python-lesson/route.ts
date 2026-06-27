import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function POST(req: NextRequest) {
  try {
    const { topicId, topicName, chapterName, chapterId, promptContext } = await req.json();

    if (!topicId || !topicName) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters: topicId and topicName." },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an elite Computer Science Professor and expert Python Software Architect.
Your task is to generate an extremely comprehensive, content-rich, professional-grade lesson on a granular Python topic.

The topic is: "${topicName}"
Under the chapter: "${chapterName}" (${chapterId})

You must output a single JSON object matching the requested schema. Provide deep, rigorous, clear explanations (aim for 600-1000 words in the markdown "theory" field), standard conventions, best practices, actual performance complexities (e.g., Big O time and space), and real-world hardware or software engineering applications.

Schema Fields Required:
1. "theory": Rigorous, comprehensive educational markdown (strictly using standard markdown, tables, bullet points, and subheadings). Include:
   - Concepts, rationale, and visual descriptions.
   - Time & Space complexity metrics.
   - Crucial tips and common pitfalls or edge cases (e.g., thread-safety, memory overhead).
2. "code": A completely self-contained, clean, bug-free, and elegant Python code example demonstrating the topic. It must have exhaustive comments, print statements explaining each step, and be fully valid Python 3 syntax.
3. "simulationSpec": An array of visual steps representing what occurs in memory or a processor during execution. Each step is an object with:
   - "title": string (e.g., "Memory Allocation", "Reference Incremented")
   - "description": string (e.g., "Integer object is created with reference count 1.")
   - "highlightCode": string (e.g., "x = 45" or "sys.getrefcount(x)")
   - "stateSummary": string (e.g., "x points to memory 0x10A; Ref Count: 1")
4. "quiz": An array of 3 highly challenging multiple-choice questions to test the student. Each question must be an object with:
   - "question": string
   - "options": array of 4 strings
   - "correctIndex": integer (0 to 3)
   - "explanation": string`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { text: systemPrompt },
        { text: `Generate the lesson for the topic: "${topicName}". Topic ID is: "${topicId}". Context: ${promptContext || ""}` }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            theory: {
              type: Type.STRING,
              description: "Markdown string with comprehensive theory, subheadings, tables, and code snippets."
            },
            code: {
              type: Type.STRING,
              description: "Plain text string containing executable Python code."
            },
            simulationSpec: {
              type: Type.ARRAY,
              description: "Memory or processor steps to visualize.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  highlightCode: { type: Type.STRING },
                  stateSummary: { type: Type.STRING }
                },
                required: ["title", "description", "highlightCode", "stateSummary"]
              }
            },
            quiz: {
              type: Type.ARRAY,
              description: "Three challenging multiple-choice questions.",
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING }
                },
                required: ["question", "options", "correctIndex", "explanation"]
              }
            }
          },
          required: ["theory", "code", "simulationSpec", "quiz"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from Gemini API");
    }

    const lessonData = JSON.parse(responseText.trim());
    return NextResponse.json({ success: true, lesson: lessonData });

  } catch (error: any) {
    console.error("Error generating Python lesson via Gemini:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate lesson content." },
      { status: 500 }
    );
  }
}
