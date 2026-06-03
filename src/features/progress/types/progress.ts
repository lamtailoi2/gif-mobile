// src/features/progress/types/progress.ts

export interface IRecoveryItem {
    day: string;
    recovery: number;
    intensity: number;
}

export interface IHealthMetrics {
    hrv: number;
    sleepScore: number;
}

export interface IAiInsight {
    text: string;
    highlight: string;
}

// Gộp chung lại thành 1 object bự cho Dashboard
export interface IProgressDashboardData {
    aiInsight: IAiInsight;
    healthMetrics: IHealthMetrics;
    recoveryData: IRecoveryItem[];
    // Sau này bạn có thể thêm volumeData và consistencyData vào đây
}