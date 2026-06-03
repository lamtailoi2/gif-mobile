export type DifficultyTone = {
  bg: string;
  border: string;
  text: string;
};

export const useDifficultyTone = (difficulty?: string): DifficultyTone => {
  const normalized = (difficulty ?? "").toUpperCase();

  if (normalized === "ADVANCED") {
    return {
      bg: "bg-[#f44336]",
      border: "border-[#f44336]",
      text: "text-white",
    };
  }

  if (normalized === "INTERMEDIATE") {
    return {
      bg: "bg-[#ff5722]",
      border: "border-[#ff5722]",
      text: "text-white",
    };
  }

  return {
    bg: "bg-[#abd600]",
    border: "border-[#d4ff5e]",
    text: "text-[#283500]",
  };
};
