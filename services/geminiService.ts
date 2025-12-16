import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

export const generateCreativeText = async (topic: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a short, catchy, creative title (max 5 words) for a design about: "${topic}". Return ONLY the text, no quotes.`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini Text Gen Error:", error);
    return "Creative Title";
  }
};

export const generateImageElement = async (prompt: string): Promise<string | null> => {
  try {
    const ai = getClient();
    // Using flash-image for faster generation for a tool like this
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: prompt,
    });
    
    // Check for inline data
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    return null;
  }
};
