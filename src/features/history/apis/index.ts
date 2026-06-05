// src/features/history/apis/index.ts
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { IHistoryOverview, IWorkoutSession } from '../types/history';

// 1. Hàm lấy dữ liệu tổng quan
export const getHistoryOverview = async (): Promise<IHistoryOverview> => {
    try {
        const docRef = doc(db, 'historyOverview', 'summary');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as IHistoryOverview;
        } else {
            return { totalWorkouts: 0, totalHours: 0, dayStreak: 0 };
        }
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu History Overview từ Firebase:', error);
        throw error;
    }
};

// 2. Hàm lấy danh sách buổi tập (Giữ nguyên của bạn)
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
        console.error('Lỗi khi lấy dữ liệu Workout Sessions từ Firebase:', error);
        throw error;
    }
};