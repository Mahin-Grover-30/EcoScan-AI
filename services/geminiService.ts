import { GoogleGenAI, Type } from "@google/genai";
import { AIScanResult } from '../types';

// FIX: Aligned with Gemini API guidelines to directly use process.env.API_KEY for initialization.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        objectName: {
            type: Type.STRING,
            description: "The name of the primary object in the image (e.g., 'soda can', 'apple core')."
        },
        category: {
            type: Type.STRING,
            description: "Classify the object into one of the following categories: 'plastic', 'paper', 'glass', 'metal', 'organic', 'cardboard', 'e-waste', 'hazardous'. If unsure, use 'unknown'.",
            enum: ['plastic', 'paper', 'glass', 'metal', 'organic', 'cardboard', 'e-waste', 'hazardous', 'unknown']
        },
        isContaminated: {
            type: Type.BOOLEAN,
            description: "True if the item has contamination like food residue, liquids, or is a mix of non-separable materials. False otherwise."
        },
        contaminationReason: {
            type: Type.STRING,
            description: "If contaminated, briefly explain why (e.g., 'Food residue inside', 'Liquid contents remaining'). Provide an empty string if not contaminated."
        },
        recyclingInstructions: {
            type: Type.STRING,
            description: "Provide simple, actionable recycling or disposal instructions. For example: 'Rinse before recycling.' or 'Dispose of in hazardous waste collection.'."
        },
        points: {
            type: Type.INTEGER,
            description: "Award points for this scan. Give 10 points for a clean, recyclable item, 5 for a contaminated but recyclable item, and 1 for non-recyclable items."
        }
    },
    required: ["objectName", "category", "isContaminated", "contaminationReason", "recyclingInstructions", "points"]
};

export async function analyzeWasteImage(base64Image: string, mimeType: string): Promise<AIScanResult> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{
                parts: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType
                        }
                    },
                    {
                        text: "Analyze the object in this image for recycling purposes. Identify the object, its material category, any contamination, and provide simple recycling instructions. Respond with a JSON object that adheres to the provided schema."
                    }
                ]
            }],
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        // Basic validation
        if (!result.category || !responseSchema.properties.category.enum.includes(result.category)) {
            result.category = 'unknown';
        }

        return result as AIScanResult;

    } catch (error) {
        console.error("Error analyzing image with Gemini API:", error);
        throw new Error("Failed to analyze image. The AI model could not process the request.");
    }
}
