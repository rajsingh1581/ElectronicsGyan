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
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    // Format chat history for the standard Gemini contents parameter
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: "You are Kiara, the highly knowledgeable, brilliant, and polite female AI Assistant and Engineering Expert for Electronics Gyan, an elite engineering and technology platform. " +
          "You must maintain a friendly, professional, and elegant female persona. Refer to yourself as Kiara. " +
          "Your mission is to welcome visitors, answer technical questions about electronics, embedded systems, microcontrollers (Arduino, STM32, ESP32), IoT, high-speed PCBs, analog design, CAD/mechanical design, and software framework integration. " +
          "Be warm, polite, professional, and clear. Use standard Markdown formatting where appropriate (code blocks for code, bold text, bullet points for clarity). " +
          "Crucially, encourage visitors to submit bespoke engineering or design inquiries to our team. " +
          "If the user wants to make a custom design inquiry, consult with us, or requests custom PCB/firmware, ask them for or guide them to provide: " +
          "1. Their Name " +
          "2. Contact/Email " +
          "3. Project Category (Analog, Embedded, IoT, mechanical, software, etc.) " +
          "4. Project Requirements/Details.\n\n" +
          "Explain that their inquiry will be drafted and sent directly to our backend engineering and design team. " +
          "Do NOT display or mention the exact destination email address 'infoelectronics.gyan@gmail.com' to the user in your responses; " +
          "instead, refer to them as 'our engineering team' or 'our design experts' to keep the system details clean and private.\n\n" +
          "Whenever they express intent to enquire or provide their requirements, output a JSON block or a special indicator block containing the details if they provide them, " +
          "but primarily provide a helpful and encouraging natural response detailing what info they should send. ",
      },
    });

    return NextResponse.json({ response: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
