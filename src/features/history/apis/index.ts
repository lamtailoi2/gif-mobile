import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { EIntensity, IWorkoutSession } from '../types/history';

const determineWorkoutType = (muscleGroups: string[]): string => {
    const muscleSet = new Set(muscleGroups.map(m => m.toLowerCase()));
    if (['chest', 'shoulders', 'arms'].filter(m => muscleSet.has(m)).length >= 2) return 'PUSH';
    if (['back'].filter(m => muscleSet.has(m)).length >= 1) return 'PULL';
    if (['legs'].filter(m => muscleSet.has(m)).length >= 1) return 'LEGS';
    if (muscleGroups.length >= 3) return 'FULL BODY';
    return 'CUSTOM';
};

const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const mapIntensity = (rating: number | undefined): EIntensity => {
    const validRating = Math.max(1, Math.min(10, rating || 5));
    if (validRating >= 8) return EIntensity.HighIntensity;
    if (validRating >= 6) return EIntensity.Intense;
    return EIntensity.Normal;
};

export const getWorkoutHistory = async (userId: string): Promise<IWorkoutSession[]> => {
    if (!userId) return [];
    try {
        const q = query(collection(db, 'workout_sessions'), where('userId', '==', userId), orderBy('completedAt', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((docItem) => {
            const data = docItem.data();
            if (!data.completedAt) return null; // Chỉ cần field này là đủ sống

            const muscleBreakdown = data.muscleBreakdown || {};
            const muscleGroups = Object.keys(muscleBreakdown).filter(k => muscleBreakdown[k]);

            return {
                id: docItem.id,
                date: data.completedAt.split('T')[0],
                time: formatTime(data.completedAt),
                intensity: mapIntensity(data.intensityRating),
                type: determineWorkoutType(muscleGroups),
                muscleGroups: muscleGroups,
            } as IWorkoutSession;
        }).filter((session) => session !== null) as IWorkoutSession[];
    } catch (error) {
        console.error('Lỗi History:', error);
        return [];
    }
};