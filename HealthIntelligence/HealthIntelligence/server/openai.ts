import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getHealthAdvice(symptoms: string): Promise<{
  diagnosis: string;
  confidence: number;
  recommendations: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a medical AI assistant. Analyze the symptoms and provide a preliminary diagnosis with recommendations. Respond with JSON in this format: { 'diagnosis': string, 'confidence': number, 'recommendations': string[] }",
        },
        {
          role: "user",
          content: symptoms,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      diagnosis: result.diagnosis,
      confidence: Math.max(0, Math.min(1, result.confidence)),
      recommendations: result.recommendations,
    };
  } catch (error) {
    throw new Error("Failed to analyze symptoms: " + error.message);
  }
}
