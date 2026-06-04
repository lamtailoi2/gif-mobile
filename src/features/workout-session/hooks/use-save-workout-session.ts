import { useMutation } from "@tanstack/react-query";
import { useUser } from "@clerk/expo";
import { saveWorkoutSession } from "../apis";
import { IWorkoutSessionPayload } from "@/interfaces/workout-session.interface";

/**
 * Mutation hook lưu buổi tập lên Firestore.
 * Tự động inject userId từ Clerk session.
 */
export const useSaveWorkoutSession = () => {
  const { user } = useUser();

  return useMutation({
    mutationFn: (payload: IWorkoutSessionPayload) => {
      if (!user?.id) throw new Error("User not authenticated");
      return saveWorkoutSession({
        ...payload,
        userId: user.id,
      });
    },
  });
};
