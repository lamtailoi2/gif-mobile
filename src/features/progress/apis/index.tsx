// src/features/progress/apis/index.ts
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { WORKOUT_SESSIONS_COLLECTION } from '@/constants/collections';
import { IProgressDashboardData } from '../types/progress';
import { getLocalDateString } from '@/utils/date';

/**
 * Calculate 7-day recovery data (most recent 7 days).
 * If not enough sessions, fill missing days with 0.
 */
const calculateRecoveryData = (sessions: any[]): any[] => {
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const energyMap: Record<string, number> = { drained: 30, steady: 70, charged: 100 };

    // Map of day (YYYY-MM-DD) to recovery data
    const sessionByDay = new Map<string, any>();
    sessions.forEach((session) => {
        const dayStr = getLocalDateString(new Date(session.completedAt));
        if (!sessionByDay.has(dayStr)) {
            sessionByDay.set(dayStr, session);
        }
    });

    // Generate last 7 days lùi về quá khứ tính từ hôm nay
    const result = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStr = getLocalDateString(date);
        const dayOfWeek = date.getDay();
        const session = sessionByDay.get(dayStr);

        result.push({
            day: daysOfWeek[dayOfWeek],
            recovery: session ? (energyMap[session.energyLevel as string] || 50) : 0,
            intensity: session ? (Math.max(1, Math.min(10, session.intensityRating || 5)) * 10) : 0,
        });
    }

    return result.reverse(); // Đảo ngược để hôm nay nằm bên phải
};

export const getProgressDashboard = async (userId: string): Promise<IProgressDashboardData | null> => {
    if (!userId) return null;

    try {
        // Ta cần dữ liệu 6 tháng qua (180 ngày) để vẽ lưới Consistency 18 tuần
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 180);

        const sessionsRef = collection(db, WORKOUT_SESSIONS_COLLECTION);
        const q = query(
            sessionsRef,
            where('userId', '==', userId),
            where('completedAt', '>=', sixMonthsAgo.toISOString()),
            orderBy('completedAt', 'desc')
        );
        const snapshot = await getDocs(q);
        // Lọc sạch dữ liệu rác
        const sessions = snapshot.docs
            .map((doc) => doc.data())
            .filter(s => s.completedAt);

        // NẾU CHƯA TẬP BUỔI NÀO -> TRẢ VỀ RỖNG
        if (sessions.length === 0) {
            return {
                workoutDates: [], // Trả về mảng rỗng
                recoveryData: [],
                aiInsight: { text: 'Start your first workout to see progress insights.', highlight: 'Start your first workout' },
            };
        }

        // 1. LẤY DANH SÁCH CÁC NGÀY ĐÃ TẬP (YYYY-MM-DD)
        const workoutDates = [...new Set(sessions.map(s => getLocalDateString(new Date(s.completedAt))))];

        // 2. TÍNH TOÁN RECOVERY TRÊN 7 NGÀY GẦN NHẤT
        const recoveryData = calculateRecoveryData(sessions);

        // 3. AI INSIGHT TỪ PATTERN 30 NGÀY QUA
        const last30Days = sessions.filter(s => new Date(s.completedAt) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
        const avg = Math.round(last30Days.length / 4); // Trung bình buổi/tuần

        return {
            workoutDates, // Truyền mảng ngày xuống component
            recoveryData,
            aiInsight: {
                text: avg >= 3 ? `You're crushed it! Averaging ${avg} workouts weekly.` : 'Maintain momentum! Aim for 3 workouts this week.',
                highlight: avg >= 3 ? `${avg} workouts weekly` : '3 workouts this week'
            },
        };
    } catch (error) {
        console.error('Lỗi Progress API:', error);
        throw error;
    }
};