import { getAllExercises } from "@/features/exercise-library/apis";
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

  const prompt = `HLV thể lực. Tạo lịch tập JSON cho user:
${JSON.stringify(p)}
Bài tập (id,n=tên,c=category,d=độ khó,m=cơ,eq=thiết bị,s=sets,r=reps):
${JSON.stringify(exerciseList)}
Chỉ dùng bài tập trong danh sách. Chỉ trả về JSON, không giải thích:
{"userAssessment":"...","schedule":[{"day":"Ngày 1","focus":"...","exercises":[{"exerciseId":"","exerciseName":"","sets":0,"reps":0}]}]}`;

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