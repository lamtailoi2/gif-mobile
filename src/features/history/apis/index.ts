// src/features/history/apis/index.ts
import { collection, getDocs } from 'firebase/firestore';

import { db } from '../../../lib/firebase';
import { IWorkoutSession } from '../types/history';

export const getWorkoutSessions = async (): Promise<IWorkoutSession[]> => {
    try {
        const sessionsRef = collection(db, 'workoutSessions');

        const snapshot = await getDocs(sessionsRef);

        const sessions = snapshot.docs.map((docItem) => {
            const data = docItem.data();
            return {
                id: docItem.id,
                title: data.title,
                date: data.date,
                time: data.time,
                durationMinutes: data.durationMinutes,
                caloriesBurned: data.caloriesBurned,
                exercisesCount: data.exercisesCount || 0,
                intensity: data.intensity,
                muscleGroups: data.muscleGroups || [],
            } as IWorkoutSession;
        });

        return sessions;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ Firebase:', error);
        throw error;
    }
};