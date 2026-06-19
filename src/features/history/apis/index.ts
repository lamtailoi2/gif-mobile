import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { WORKOUT_SESSIONS_COLLECTION } from '@/constants/collections';
import { IExerciseLog } from '../../../interfaces/workout-session.interface';
import { EIntensity, IWorkoutSession } from '../types/history';
import { getLocalDateString } from '@/utils/date';

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
        const q = query(collection(db, WORKOUT_SESSIONS_COLLECTION), where('userId', '==', userId), orderBy('completedAt', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((docItem) => {
            const data = docItem.data();
            if (!data.completedAt) return null; // Chỉ cần field này là đủ sống

            const muscleBreakdown = data.muscleBreakdown || {};
            const muscleGroups = Object.keys(muscleBreakdown).filter(k => muscleBreakdown[k]);

            return {
                id: docItem.id,
                date: getLocalDateString(new Date(data.completedAt)),
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

export const getLatestSessionFullLogs = async (userId: string): Promise<IExerciseLog[]> => {
    if (!userId) return [];
    try {
        const q = query(
            collection(db, WORKOUT_SESSIONS_COLLECTION),
            where('userId', '==', userId),
            orderBy('completedAt', 'desc'),
            limit(1)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return [];
        
        const data = snapshot.docs[0].data();
        return data.exerciseLogs || [];
    } catch (error) {
        console.error('Lỗi lấy full logs:', error);
        return [];
    }
};

export const getSessionById = async (sessionId: string) => {
    if (!sessionId) return null;
    try {
        const docRef = doc(db, WORKOUT_SESSIONS_COLLECTION, sessionId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error('Error fetching session details:', error);
        return null;
    }
};