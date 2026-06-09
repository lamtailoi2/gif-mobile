

import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../lib/firebase'; // Đảm bảo đúng đường dẫn db của bạn
import { IWorkoutSession } from '../types/history';

export const getWorkoutHistory = async (): Promise<IWorkoutSession[]> => {
    try {
        const sessionsRef = collection(db, 'workoutSessions');
        // Sắp xếp ngày mới nhất lên đầu
        const q = query(sessionsRef, orderBy('date', 'desc'));
        const snapshot = await getDocs(q);

        // RẤT QUAN TRỌNG: Bắt buộc phải có chữ "return" ở dòng này
        return snapshot.docs.map((docItem) => {
            const data = docItem.data();
            return {
                id: docItem.id,
                title: data.title || 'Untitled Workout',
                date: data.date || '',
                time: data.time || '',
                durationMinutes: data.durationMinutes || 0,
                caloriesBurned: data.caloriesBurned || 0,
                exercisesCount: data.exercisesCount || 0,
                intensity: data.intensity || 'NORMAL',
                type: data.type || 'CUSTOM',
                muscleGroups: data.muscleGroups || [],
            } as IWorkoutSession;
        });
    } catch (error) {
        console.error('Lỗi lấy dữ liệu History:', error);
        return [];
    }
};
