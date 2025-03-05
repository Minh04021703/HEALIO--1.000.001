import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const healthResponseSchema = z.object({
  diagnosis: z.string(),
  confidence: z.number(),
  recommendations: z.array(z.string()),
});

type HealthResponse = z.infer<typeof healthResponseSchema>;

async function sanitizeInput(text: string): Promise<string> {
  return text.trim()
    .replace(/[^\p{L}\p{N}\s.,!?-]/gu, '')
    .replace(/\s+/g, ' ');
}

async function callGemini(symptoms: string): Promise<HealthResponse> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Unable to connect. Please try again later.");
  }

  const sanitizedSymptoms = await sanitizeInput(symptoms);

  if (sanitizedSymptoms.length < 5) {
    throw new Error("Please provide more details about your symptoms.");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-pro",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1000,
    }
  });

  const prompt = `Analyze these symptoms and provide health advice. Format as JSON:
{
  "diagnosis": "Brief assessment",
  "confidence": number from 0 to 1,
  "recommendations": [
    "What to do now",
    "When to see a doctor"
  ]
}

Symptoms: "${sanitizedSymptoms}"

Note: This is initial advice only, not a medical diagnosis.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(text);
    } catch {
      throw new Error("Please try again in a moment.");
    }

    const validatedResponse = healthResponseSchema.parse(jsonResponse);
    return validatedResponse;

  } catch (error: any) {
    console.error("Gemini API Error:", error);

    if (error instanceof z.ZodError) {
      throw new Error("Please try again.");
    }

    if (error.message.includes("NOT_FOUND") || error.message.includes("model not found")) {
      throw new Error("Service is busy. Please try again in a moment.");
    }

    throw new Error("Please try again later.");
  }
}

export async function getHealthAdvice(symptoms: string): Promise<HealthResponse> {
  try {
    return await callGemini(symptoms);
  } catch (error) {
    console.error("Health Advice Error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Please try again later.");
  }
}