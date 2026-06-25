import { USER_AI_PLANS_COLLECTION } from "@/constants/collections";
import { GOAL_CATEGORY_MAP } from "@/constants/goal-category-map";
import { EExperienceLevel } from "@/constants/profile.constant";
import { getExercisesByCategories } from "@/features/exercise-library/apis";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { IWorkoutPlanResponse } from "./types";

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

  const userGoal = profile.goal ?? "maintain_health";
  const preferredCategories = GOAL_CATEGORY_MAP[userGoal] ?? [];

  // Fetch exercises matching goal categories directly from Firestore (max 30 preferred + 10 filler)
  const preferred = await getExercisesByCategories(preferredCategories, 30);
  const otherCategories = Object.values(GOAL_CATEGORY_MAP)
    .flat()
    .filter((c) => !preferredCategories.includes(c))
    .filter((c, i, arr) => arr.indexOf(c) === i);
  const filler = preferred.length < 30 && otherCategories.length > 0
    ? await getExercisesByCategories(otherCategories, 40 - preferred.length)
    : [];

  const selectedExercises = [...preferred, ...filler].slice(0, 40);

  console.log(`Sending ${selectedExercises.length} exercises to AI (${preferred.length} preferred + ${filler.length} filler)`);

  // Map string IDs to numeric IDs to reduce token usage
  const numericIdToOriginalMap = new Map<string, { id: string; name: string }>();

  // Chỉ gửi các field tối thiểu cần thiết để AI lên lịch tập
  const exerciseList = selectedExercises.map((e, index) => {
    const numericId = String(index + 1);
    numericIdToOriginalMap.set(numericId, { id: e.id, name: e.name });
    return {
      id: numericId,
      n: e.name,
      c: e.category,
      m: Array.isArray(e.muscleGroups) ? e.muscleGroups.join(",") : e.muscleGroups,
      s: e.defaultSets,
      r: e.defaultReps,
    };
  });

  // Xác định số lượng bài tập mỗi ngày dựa trên level
  const userLevel = profile.level ?? EExperienceLevel.Beginner;
  let exercisesPerDay = 4;
  if (userLevel === EExperienceLevel.Intermediate) {
    exercisesPerDay = 5;
  } else if (userLevel === EExperienceLevel.Advanced) {
    exercisesPerDay = 6;
  }

  const goalRules: Record<string, string> = {
    build_muscle: `No dedicated cardio-only days. Each day needs at least ${exercisesPerDay - 1} strength/compound exercises. Max 1 cardio or plyometric exercise per day as finisher.`,
    lose_weight: `Prioritize cardio and plyometric exercises. Each day needs at least ${exercisesPerDay - 1} cardio/plyometric exercises. Max 1 strength exercise per day.`,
    endurance: `Mix cardio and bodyweight exercises. At least ${Math.floor(exercisesPerDay / 2)} cardio exercises per day. Avoid heavy compound lifts.`,
    stay_fit: `Balance strength and cardio evenly. Each day should have a mix of both. No more than ${Math.ceil(exercisesPerDay / 2)} cardio exercises per day.`,
    improve_flexibility: `Prioritize stretching and mobility exercises. Each day needs at least ${exercisesPerDay - 1} stretching exercises.`,
  };

  const goalRule = goalRules[profile.goal] ?? `Balance exercises based on user goal.`;

  const p = {
    goal: profile.goal,
    level: profile.level,
    gender: profile.gender,
    daysPerWeek: profile.daysPerWeek,
  };

  const prompt = `Create a ${profile.daysPerWeek}-day workout plan as JSON.
User: ${JSON.stringify(p)}
Exercises(id,n,c,m,s,r): ${JSON.stringify(exerciseList)}

Rules:
1. Use ONLY exercise IDs from the list above.
2. Every day MUST have exactly ${exercisesPerDay} exercises, no more, no less.
3. ${goalRule}
4. Do NOT repeat the same exercise ID in one days.
5. Match exercises to the muscle group focus of each day.
6. Strength exercises: r=rep count. Cardio/plyometric/stretching: r=seconds (30,45, or 60).

Return ONLY this JSON structure:
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
      max_tokens: 10000,
      temperature: 0.1,
      // Ép buộc Groq chỉ trả về JSON object thuần, không trả code hay text khác
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a fitness API. You ONLY output valid JSON. Output raw JSON only. No code, no markdown, no explanations."
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
    const rawPlan = JSON.parse(match[0]) as IWorkoutPlanResponse;

    // Restore original IDs and names from the numeric mapping
    const schedule = rawPlan.schedule.map((daySchedule) => ({
      ...daySchedule,
      exercises: daySchedule.exercises.map((genExercise) => {
        const originalInfo = numericIdToOriginalMap.get(String(genExercise.exerciseId));
        return {
          ...genExercise,
          exerciseId: originalInfo ? originalInfo.id : genExercise.exerciseId,
          exerciseName: originalInfo ? originalInfo.name : genExercise.exerciseName,
        };
      }),
    }));

    return {
      ...rawPlan,
      schedule,
    };
  } catch (error) {
    console.error("Failed to parse response:", generatedText, error);
    throw new Error("Failed to parse AI response as JSON.");
  }
}

export async function saveAiWorkoutPlan(userId: string, plan: IWorkoutPlanResponse): Promise<void> {
  try {
    const docRef = doc(db, USER_AI_PLANS_COLLECTION, userId);
    await setDoc(docRef, { ...plan, currentPlanIndex: 0, updatedAt: new Date().toISOString() });
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