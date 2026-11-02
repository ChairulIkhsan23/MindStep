export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    timezone?: string;
    theme?: 'light' | 'dark' | 'system';
    ai_consent?: boolean;
}

export interface UserStreak {
    current_streak: number;
    longest_streak: number;
    today_perfect: boolean;
    today_habits_completed: number;
    today_habits_total: number;
    today_journal_completed: boolean;
    is_at_risk: boolean;
    streak_level: {
        level: number;
        label: string;
        badge: string;
    };
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
        streak?: UserStreak | null;
    };
};
