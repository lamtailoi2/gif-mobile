import { offlineCache } from '@/lib/offline-cache';
import { isOnline } from '@/hooks/use-network';
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { WORKOUT_SESSIONS_COLLECTION } from '@/constants/collections';
import { IExerciseLog } from '../../../interfaces/workout-session.interface';
import { EIntensity, IWorkoutSession } from '../types/history';
import { getLocalDateString } from '@/utils/date';

const historyCacheKey = (uid: string) => `offline:history:${uid}`;
const sessionCacheKey = (sid: string) => `offline:session:${sid}`;

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
        if (!(await isOnline())) {
            const cached = await offlineCache.get<IWorkoutSession[]>(historyCacheKey(userId));
            if (cached) return cached;
        }
        const q = query(collection(db, WORKOUT_SESSIONS_COLLECTION), where('userId', '==', userId), orderBy('completedAt', 'desc'));
        const snapshot = await getDocs(q);

        const sessions = snapshot.docs.map((docItem) => {
            const data = docItem.data();
            if (!data.completedAt) return null;

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

        await offlineCache.set(historyCacheKey(userId), sessions);
        return sessions;
    } catch (error) {
        console.error('Lỗi History:', error);
        const cached = await offlineCache.get<IWorkoutSession[]>(historyCacheKey(userId));
        return cached ?? [];
    }
};

export const getLatestSessionFullLogs = async (userId: string): Promise<IExerciseLog[]> => {
    if (!userId) return [];
    try {
        if (!(await isOnline())) {
            const cached = await offlineCache.get<IExerciseLog[]>(historyCacheKey(userId) + ':logs');
            if (cached) return cached;
        }
        const q = query(
            collection(db, WORKOUT_SESSIONS_COLLECTION),
            where('userId', '==', userId),
            orderBy('completedAt', 'desc'),
            limit(1)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return [];
        
        const data = snapshot.docs[0].data();
        const logs = data.exerciseLogs || [];
        await offlineCache.set(historyCacheKey(userId) + ':logs', logs);
        return logs;
    } catch (error) {
        console.error('Lỗi lấy full logs:', error);
        const cached = await offlineCache.get<IExerciseLog[]>(historyCacheKey(userId) + ':logs');
        return cached ?? [];
    }
};

export const getSessionById = async (sessionId: string) => {
    if (!sessionId) return null;
    try {
        if (!(await isOnline())) {
            const cached = await offlineCache.get(sessionCacheKey(sessionId));
            if (cached) return cached;
        }
        const docRef = doc(db, WORKOUT_SESSIONS_COLLECTION, sessionId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = { id: docSnap.id, ...docSnap.data() };
            await offlineCache.set(sessionCacheKey(sessionId), data);
            return data;
        }
        return null;
    } catch (error) {
        console.error('Error fetching session details:', error);
        return offlineCache.get(sessionCacheKey(sessionId));
    }
};