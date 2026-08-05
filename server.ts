import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Gemini features will return fallback response or error.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Route: Generate AI Personal Fitness & Nutrition Plan
app.post("/api/ai/fitness-plan", async (req, res) => {
  try {
    const { heightCm, weightKg, age, gender, bodyStructure, goal, activityLevel } = req.body;

    if (!heightCm || !weightKg || !age) {
      return res.status(400).json({ error: "Missing required body metrics (height, weight, age)" });
    }

    const ai = getGeminiClient();

    const prompt = `You are an elite sports scientist, exercise physiologist, and nutritionist.
Generate a tailored fitness and nutrition plan based strictly on these metrics:
- Age: ${age}
- Gender: ${gender}
- Height: ${heightCm} cm
- Weight: ${weightKg} kg
- Body Structure: ${bodyStructure} (e.g., Ectomorph, Mesomorph, Endomorph, Athletic)
- Main Fitness Goal: ${goal}
- Daily Activity Level: ${activityLevel}

Analyze their metabolic profile and provide:
1. Exact estimated BMR, TDEE, recommended daily calories, and macro breakdown (protein, carbs, fat in grams).
2. A body summary explaining why these specific exercises and macros suit their exact body structure (${bodyStructure}) and goal (${goal}).
3. 3 to 4 specific exercise routines tailored to their body structure, complete with set/rep scheme, estimated calories burned, difficulty, and step-by-step cues.
4. A 1-day sample meal plan with high efficiency recipes.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bmr: { type: Type.NUMBER },
            tdee: { type: Type.NUMBER },
            recommendedCalories: { type: Type.NUMBER },
            macros: {
              type: Type.OBJECT,
              properties: {
                proteinGrams: { type: Type.NUMBER },
                carbsGrams: { type: Type.NUMBER },
                fatGrams: { type: Type.NUMBER },
              },
              required: ["proteinGrams", "carbsGrams", "fatGrams"],
            },
            bodySummary: { type: Type.STRING },
            suggestedExercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  category: { type: Type.STRING, description: "Strength, Cardio, HIIT, Flexibility, or Calisthenics" },
                  targetBodyPart: { type: Type.STRING },
                  durationMinutes: { type: Type.NUMBER },
                  sets: { type: Type.NUMBER },
                  reps: { type: Type.STRING },
                  caloriesBurned: { type: Type.NUMBER },
                  difficulty: { type: Type.STRING, description: "Beginner, Intermediate, or Advanced" },
                  whySuitable: { type: Type.STRING },
                  steps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ["title", "category", "targetBodyPart", "durationMinutes", "caloriesBurned", "steps"],
              },
            },
            sampleMealPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  mealType: { type: Type.STRING },
                  title: { type: Type.STRING },
                  calories: { type: Type.NUMBER },
                  proteinGrams: { type: Type.NUMBER },
                  prepTimeMinutes: { type: Type.NUMBER },
                },
                required: ["mealType", "title", "calories", "proteinGrams", "prepTimeMinutes"],
              },
            },
          },
          required: ["bmr", "tdee", "recommendedCalories", "macros", "bodySummary", "suggestedExercises", "sampleMealPlan"],
        },
      },
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);
    res.json(data);
  } catch (error: any) {
    console.error("Error generating AI fitness plan:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI fitness plan" });
  }
});

// API Route: Custom Recipe Generator based on ingredients or goal
app.post("/api/ai/recipe-generator", async (req, res) => {
  try {
    const { ingredients, preference, targetProtein, maxPrepTimeMinutes } = req.body;

    const ai = getGeminiClient();

    const prompt = `Generate a healthy, ultra-efficient recipe designed for high fitness performance.
User input:
- Available Ingredients: ${ingredients || "Chicken, Oats, Eggs, Avocado, Rice, Spinach"}
- Preference/Diet: ${preference || "High Protein & Quick Prep"}
- Target Protein: ${targetProtein || "35+"}g
- Max Prep Time: ${maxPrepTimeMinutes || 15} minutes

Provide a delicious, easy-to-cook recipe with concise steps and efficiency rating (1-10).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            prepTimeMinutes: { type: Type.NUMBER },
            cookTimeMinutes: { type: Type.NUMBER },
            calories: { type: Type.NUMBER },
            proteinGrams: { type: Type.NUMBER },
            carbsGrams: { type: Type.NUMBER },
            fatGrams: { type: Type.NUMBER },
            efficiencyRating: { type: Type.NUMBER },
            difficulty: { type: Type.STRING },
            ingredients: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            instructions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            "title",
            "category",
            "prepTimeMinutes",
            "cookTimeMinutes",
            "calories",
            "proteinGrams",
            "carbsGrams",
            "fatGrams",
            "efficiencyRating",
            "difficulty",
            "ingredients",
            "instructions",
          ],
        },
      },
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);
    res.json(data);
  } catch (error: any) {
    console.error("Error generating recipe:", error);
    res.status(500).json({ error: error.message || "Failed to generate recipe" });
  }
});

// API Route: AI Coach Chat / Advice
app.post("/api/ai/coach-advice", async (req, res) => {
  try {
    const { query, profile } = req.body;
    const ai = getGeminiClient();

    const prompt = `You are FitBot, an encouraging, energetic, high-performance Gamified AI Fitness Coach.
User Profile:
- Age: ${profile?.age || 25}, Weight: ${profile?.weightKg || 70}kg, Height: ${profile?.heightCm || 175}cm
- Body Structure: ${profile?.bodyStructure || 'Mesomorph'}, Goal: ${profile?.goal || 'muscle_gain'}
- Current Level: ${profile?.level || 1}

User Question/Request: "${query}"

Provide a motivating, highly actionable, concise response (under 180 words) with clear steps, form tips, or encouragement. Include gamified cheer terms like "Champion", "Quest Accepted", or "Level Up!".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({ advice: response.text });
  } catch (error: any) {
    console.error("Error asking AI Coach:", error);
    res.status(500).json({ error: error.message || "Failed to contact AI Coach" });
  }
});

// Start Express Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
