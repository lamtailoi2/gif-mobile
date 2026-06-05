// src/features/progress/apis/index.ts
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { IProgressDashboardData } from '../types/progress';

export const getProgressDashboard = async (): Promise<IProgressDashboardData> => {
    try {
        const docRef = doc(db, 'progressOverview', 'summary');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as IProgressDashboardData;
        } else {
            throw new Error('Không tìm thấy dữ liệu Progress');
        }
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu Progress:', error);
        throw error;
    }
};