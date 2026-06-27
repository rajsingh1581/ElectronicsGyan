import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

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
    const { topicName, chapterName, messages } = await req.json();

    if (!topicName || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters: topicName and messages array." },
        { status: 400 }
      );
    }

    const systemInstruction = `You are an expert Python AI Tutor. The student is currently studying the topic "${topicName}" inside the chapter "${chapterName}".
Answer their questions with absolute accuracy, provide clear code snippets, visual descriptions, and positive, encouraging support. Keep responses concise, clear, and highly focused on Python.`;

    // Map history to the format expected by the Gemini chat API
    // We will build a unified prompt with context or use the chats API
    const formattedPrompt = messages.map(msg => `${msg.sender === 'user' ? 'Student' : 'AI Tutor'}: ${msg.text}`).join("\n") + "\nAI Tutor:";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from Gemini API");
    }

    return NextResponse.json({ success: true, reply: responseText.trim() });

  } catch (error: any) {
    console.error("Error in Python Chat Tutor:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process chat response." },
      { status: 500 }
    );
  }
}
