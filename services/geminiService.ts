import { GoogleGenAI, Modality } from "@google/genai";
import { ImageSize } from "../types";

// Helper to get the correct AI instance. 
// For paid features (Veo/Pro Image), we need the user-selected key.
const getAIClient = async (requireUserKey: boolean = false) => {
  let apiKey = process.env.API_KEY;
  
  if (requireUserKey) {
    // If the window.aistudio object exists, use it to check for a selected key
    if (window.aistudio) {
        // We assume the environment variable is updated after selection, 
        // OR the client handles it internally if we instantiate new GoogleGenAI
        // However, standard pattern:
        apiKey = process.env.API_KEY; 
    }
  }

  // Fallback for safety if process.env.API_KEY is undefined (though it should be injected)
  if (!apiKey) {
      console.warn("API Key is missing. Features may not work until selected.");
  }

  return new GoogleGenAI({ apiKey: apiKey });
};

export const generateHighQualityImage = async (prompt: string, size: ImageSize): Promise<string> => {
  const ai = await getAIClient(true); // Requires user key for Pro Image model
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1", // Default square for appliances
          imageSize: size,
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
};

export const createChatSession = async () => {
  const ai = await getAIClient();
  return ai.chats.create({
    model: 'gemini-3-pro-preview', // Complex Text Tasks
    config: {
        systemInstruction: "You are the Kingsware Concierge, a sophisticated AI assistant for a premium appliance distributor. You represent high-end brands Fisher & Paykel and De Dietrich. Your tone is professional, minimalist, and knowledgeable about luxury kitchens, cooking, and appliance specifications. Keep answers concise and elegant."
    }
  });
};

export const generateSpeech = async (text: string): Promise<ArrayBuffer> => {
  const ai = await getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-tts',
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Fenrir' }, // Deep, premium voice
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("No audio data generated");
  }

  // Convert base64 string to ArrayBuffer equivalent (Uint8Array)
  const binaryString = atob(base64Audio);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};