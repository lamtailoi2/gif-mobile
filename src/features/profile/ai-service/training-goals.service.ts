import { getAllExercises } from "@/features/exercise-library/apis";
import { IWorkoutPlanResponse } from "./types";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { USER_AI_PLANS_COLLECTION } from "@/constants/collections";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

function getApiKey(): string {
  const key = process.env.GROQ_API_KEY ?? process.env.EXPO_PUBLIC_GROQ_API_KEY ?? "";
  console.log("Using API key:", key.slice(0, 10) + "...");
  return key;
}

export async function generateWorkoutPlan(
  profile: any
): Promise<IWorkoutPlanResponse> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("GROQ_API_KEY is not set.");

  const exercises = await getAllExercises();
  console.log("Exercises loaded:", exercises?.length);
  const exerciseList = exercises.map((e) => ({
    id: e.id,
    n: e.name,
    c: e.category,
    d: e.difficulty,
    m: e.muscleGroups,
    eq: e.equipment,
    s: e.defaultSets,
    r: e.defaultReps,
  }));

  const p = {
    goal: profile.goal,
    level: profile.level,
    gender: profile.gender,
    heightCm: profile.heightCm,
    weightKg: profile.weightKg,
    daysPerWeek: profile.daysPerWeek,
  };

  const prompt = `Fitness Coach. Create JSON workout plan for user:
${JSON.stringify(p)}
Exercises (id,n=name,c=category,d=difficulty,m=muscles,eq=equipment,s=sets,r=reps):
${JSON.stringify(exerciseList)}
IMPORTANT: For time-based exercises (cardio, stretching, mobility, plyometrics, "jump", "bound", "plank", "hold"), the 'reps' field represents SECONDS. Set it to 30, 45, or 60. Do NOT use small numbers like 6 or 8 for time-based exercises.
Use only exercises from the list. Return ONLY JSON, no explanation:
{"userAssessment":"...","schedule":[{"day":"Day 1","focus":"...","exercises":[{"exerciseId":"","exerciseName":"","sets":0,"reps":0}]}]}`;

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      max_tokens: 2000,
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API request failed: ${response.status} - ${errorText}`);
  }

  const responseData = await response.json();
  const generatedText = responseData?.choices?.[0]?.message?.content;

  if (!generatedText) throw new Error("Groq API returned empty response.");

  try {
    const match = generatedText.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON object found in response.");
    return JSON.parse(match[0]) as IWorkoutPlanResponse;
  } catch (error) {
    console.error("Failed to parse response:", generatedText, error);
    throw new Error("Failed to parse AI response as JSON.");
  }
}

export async function saveAiWorkoutPlan(userId: string, plan: IWorkoutPlanResponse): Promise<void> {
  try {
    const docRef = doc(db, USER_AI_PLANS_COLLECTION, userId);
    await setDoc(docRef, { ...plan, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.error("Failed to save AI plan to Firestore:", error);
  }
}

export async function getAiWorkoutPlan(userId: string): Promise<IWorkoutPlanResponse | null> {
  try {
    const docRef = doc(db, USER_AI_PLANS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as IWorkoutPlanResponse;
    }
  } catch (error) {
    console.error("Failed to get AI plan from Firestore:", error);
  }
  return null;
}