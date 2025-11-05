import { GoogleGenAI, Type } from "@google/genai";
import { CreatureData } from '../types';

// Use Vite's way of handling environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey });

const creatureSchema = {
    type: Type.OBJECT,
    properties: {
        description: { type: Type.STRING, description: "A short, visual description of a fantasy creature for an image prompt (e.g., a majestic griffin with fiery wings, a goblin tinkerer with goggles)." },
        rarity: { type: Type.STRING, description: "The rarity of the card, one of: N, R, SR, SSR." },
        hp: { type: Type.INTEGER, description: "Health points. For N: 100-1000, R: 1001-3000, SR: 3001-6000, SSR: 6001-9999." },
        atk: { type: Type.INTEGER, description: "Attack power. For N: 10-100, R: 101-300, SR: 301-600, SSR: 601-999." },
        def: { type: Type.INTEGER, description: "Defense power. For N: 10-100, R: 101-300, SR: 301-600, SSR: 601-999." },
    },
    required: ["description", "rarity", "hp", "atk", "def"]
};

export const generateCreatureInfo = async (seed: string): Promise<CreatureData> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the seed number "${seed}", generate information for a random fantasy creature for a battle card. Generate a wide variety of creatures (e.g., goblin, griffin, golem, lich, sea serpent), NOT just dragons. The rarity should influence the stats. Create a short, compelling visual description for the image prompt.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: creatureSchema,
            },
        });

        const jsonString = response.text.trim();
        const creatureData = JSON.parse(jsonString);

        // Basic validation
        if (!creatureData.description || !creatureData.rarity) {
            throw new Error("Invalid data structure received from API.");
        }

        return creatureData as CreatureData;

    } catch (error) {
        console.error("Error generating creature info:", error);
        throw new Error("Failed to generate creature information from the AI. Please try again.");
    }
};
