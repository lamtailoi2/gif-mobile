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

  // Lọc bài tập thông minh dựa theo mục tiêu & trình độ của user
  // để giảm kích thước prompt, tránh lỗi TPM rate limit của Groq (limit 6000 tokens).
  const GOAL_CATEGORY_MAP: Record<string, string[]> = {
    build_muscle:       ["strength", "powerlifting"],
    lose_weight:        ["cardio", "hiit", "strength", "plyometrics"],
    improve_endurance:  ["cardio", "hiit", "plyometrics", "mobility"],
    maintain_health:    ["strength", "cardio", "mobility", "stretching"],
  };
  const userGoal = profile.goal ?? "maintain_health";
  const preferredCategories = GOAL_CATEGORY_MAP[userGoal] ?? [];

  // Ưu tiên các bài khớp category với goal; bổ sung thêm các bài khác nếu chưa đủ
  const preferred = exercises.filter((e) =>
    preferredCategories.includes((e.category ?? "").toLowerCase())
  );
  const others = exercises.filter(
    (e) => !preferredCategories.includes((e.category ?? "").toLowerCase())
  );

  // Lấy tối đa 40 bài (đủ đa dạng, an toàn với token limit)
  const MAX_EXERCISES = 40;
  const selectedExercises = [
    ...preferred.slice(0, Math.min(preferred.length, 30)),
    ...others.slice(0, Math.max(0, MAX_EXERCISES - Math.min(preferred.length, 30))),
  ].slice(0, MAX_EXERCISES);

  console.log(`Sending ${selectedExercises.length} exercises to AI (filtered from ${exercises.length})`);

  // Chỉ gửi các field tối thiểu cần thiết để AI lên lịch tập
  const exerciseList = selectedExercises.map((e) => ({
    id: e.id,
    n: e.name,
    c: e.category,
    m: Array.isArray(e.muscleGroups) ? e.muscleGroups.join(",") : e.muscleGroups,
    s: e.defaultSets,
    r: e.defaultReps,
  }));

  const p = {
    goal: profile.goal,
    level: profile.level,
    gender: profile.gender,
    daysPerWeek: profile.daysPerWeek,
  };

  const prompt = `Fitness coach. Create a JSON workout plan.
User: ${JSON.stringify(p)}
Exercises(id,n=name,c=category,m=muscles,s=sets,r=reps):
${JSON.stringify(exerciseList)}
Rules: Use only IDs from list. For cardio/plyometrics/stretching exercises, r=seconds(30,45,60). For strength, r=reps count.
Return ONLY JSON:
{"userAssessment":"...","schedule":[{"day":"Day 1","focus":"...","exercises":[{"exerciseId":"","exerciseName":"","sets":0,"reps":0}]}]}`;

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      // llama-3.3-70b-versatile: tuân thủ instruction tốt hơn 8b, ít bị hallucinate
      model: "llama-3.3-70b-versatile",
      max_tokens: 1500,
      temperature: 0.1,
      // Ép buộc Groq chỉ trả về JSON object thuần, không trả code hay text khác
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a fitness API. You ONLY output valid JSON. Never write code, never write explanations, never use markdown. Output ONLY a raw JSON object."
        },
        { role: "user", content: prompt }
      ],
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
    // response_format: json_object đảm bảo Groq trả về JSON thuần
    // Vẫn giữ fallback regex phòng khi API trả kèm markdown wrapping
    const text = generatedText.trim();
    const match = text.match(/\{[\s\S]*\}/);
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