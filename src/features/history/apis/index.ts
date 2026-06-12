
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { IWorkoutSession } from '../types/history';

const WORKOUT_SESSIONS_COLLECTION = 'workout_sessions';

export const getWorkoutHistory = async (userId?: string): Promise<IWorkoutSession[]> => {
    try {
        const sessionsRef = collection(db, WORKOUT_SESSIONS_COLLECTION);
        // Filter theo userId nếu có, sort in-memory để tránh composite index
        const q = userId
            ? query(sessionsRef, where('userId', '==', userId))
            : query(sessionsRef);
        const snapshot = await getDocs(q);

        return snapshot.docs
            .map((docItem) => {
                const data = docItem.data();
                const durationSec: number = data.durationSec || 0;
                const exerciseLogs: any[] = data.exerciseLogs || [];
                const muscleBreakdown: Record<string, boolean> = data.muscleBreakdown || {};

                return {
                    id: docItem.id,
                    title: data.routineName || 'Untitled Workout',
                    date: data.completedAt ? data.completedAt.split('T')[0] : '',
                    time: data.completedAt
                        ? new Date(data.completedAt).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })
                        : '',
                    durationMinutes: Math.round(durationSec / 60),
                    caloriesBurned: 0, // không lưu calories
                    exercisesCount: exerciseLogs.length,
                    intensity: data.intensityRating >= 8 ? 'HIGH' : data.intensityRating >= 5 ? 'NORMAL' : 'LOW',
                    type: data.routineName || 'CUSTOM',
                    muscleGroups: Object.keys(muscleBreakdown).filter((k) => muscleBreakdown[k]),
                } as IWorkoutSession;
            })
            .sort((a, b) => (b.date > a.date ? 1 : -1));
    } catch (error) {
        console.error('Lỗi lấy dữ liệu History:', error);
        return [];
    }
};
