
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

interface GeminiEditResult {
    image: string | null;
    text: string | null;
    mimeType: string | null;
}

export const editImageWithGemini = async (
    base64ImageData: string,
    mimeType: string,
    prompt: string
): Promise<GeminiEditResult> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageData,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        const result: GeminiEditResult = { image: null, text: null, mimeType: null };

        if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    result.image = part.inlineData.data;
                    result.mimeType = part.inlineData.mimeType;
                } else if (part.text) {
                    result.text = (result.text || "") + part.text;
                }
            }
        }
        
        if (!result.image && !result.text) {
             throw new Error("API returned an empty response. The prompt may have been blocked.");
        }

        return result;

    } catch (error: any) {
        console.error("Gemini API call failed:", error);
        throw new Error(error.message || "Failed to communicate with the Gemini API.");
    }
};
