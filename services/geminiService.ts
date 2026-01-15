
import { GoogleGenAI, Type } from "@google/genai";
import { MotivationQuote } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDailyMotivation = async (): Promise<MotivationQuote> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a powerful motivational quote for a warrior-tier workout. Source from Marvel (MCU/Comics) or Shonen/Seinen Anime. Focus on willpower and overcoming physical limits. Return JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quote: { type: Type.STRING },
            source: { type: Type.STRING },
            character: { type: Type.STRING }
          },
          required: ["quote", "source", "character"]
        }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (error) {
    return {
      quote: "The only limit is the one you set for yourself.",
      source: "Marvel Comics",
      character: "Captain America"
    };
  }
};

export const getAdaptiveAdvice = async (progress: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on this recent workout progress: ${progress}, provide a one-sentence piece of adaptive training advice. It should be intense, motivational, and sound like it's coming from a master of combat. Max 20 words.`,
    });
    return response.text || "Push beyond your limits, Warrior.";
  } catch {
    return "The path to mastery is long. Stay consistent.";
  }
};

export const generateWeeklyChallenges = async (level: number) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User is Level ${level} in a superhuman training app. Generate 6 Physical and 6 Mental weekly challenges. Provide a mix of difficulties: some should be 'Doable/Achievable' and some 'Extreme/Elite'. Use Marvel/Anime theme. Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            physical: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  id: { type: Type.STRING }
                }
              }
            },
            mental: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  id: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    const data = JSON.parse(response.text.trim());
    return {
      physical: data.physical.map((c: any) => ({ ...c, completed: false })),
      mental: data.mental.map((c: any) => ({ ...c, completed: false }))
    };
  } catch {
    return {
      physical: [
        { id: 'p1', text: 'Daily: 50 Extra Pushups (Doable)', completed: false },
        { id: 'p2', text: 'Complete a 5KM run without stopping (Moderate)', completed: false },
        { id: 'p3', text: '100 Pull-ups in a single session (Extreme)', completed: false },
        { id: 'p4', text: '300 Sit-ups throughout the week (Achievable)', completed: false },
        { id: 'p5', text: 'Master 3 new running drills (Moderate)', completed: false },
        { id: 'p6', text: 'Shadow box for 15 mins every evening (Doable)', completed: false }
      ],
      mental: [
        { id: 'm1', text: 'Read 20 pages of non-fiction (Achievable)', completed: false },
        { id: 'm2', text: 'Solve 10 complex logic puzzles (Moderate)', completed: false },
        { id: 'm3', text: 'Complete 3 deep study sessions without phone (Extreme)', completed: false },
        { id: 'm4', text: 'Learn 5 new vocabulary words daily (Doable)', completed: false },
        { id: 'm5', text: 'Meditate for 10 mins before bed (Achievable)', completed: false },
        { id: 'm6', text: 'Write 500 words for your future vision (Moderate)', completed: false }
      ]
    };
  }
};

export const getWeeklyChallenge = async (progress: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on this progress: ${progress}, suggest ONE new physical challenge for the next week. Make it sound like an anime power-up mission. Keep it under 20 words.`,
    });
    return response.text;
  } catch {
    return "Complete 150% of your daily push-up goal on Saturday.";
  }
};

export const getFluteMasteryEstimate = async (technique: string, currentMins: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User has practiced the Indian Flute technique "${technique}" for ${currentMins} minutes. Estimate how many more days/hours of consistent practice to reach a basic mastery level. Provide a concise, encouraging estimate.`,
    });
    return response.text;
  } catch {
    return "Around 20 more hours of focused practice should build muscle memory.";
  }
};
