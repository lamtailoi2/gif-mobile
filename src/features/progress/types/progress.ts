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

export interface IProgressDashboardData {
    workoutDates: string[];
    recoveryData: IRecoveryItem[];
    aiInsight: IAiInsight;
    healthMetrics?: IHealthMetrics;
}