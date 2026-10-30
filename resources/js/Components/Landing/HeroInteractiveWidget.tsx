import { useState } from 'react';

interface HabitItem {
    id: number;
    name: string;
    target: string;
    completed: boolean;
}

export default function HeroInteractiveWidget() {
    const [habits, setHabits] = useState<HabitItem[]>([
        { id: 1, name: 'Minum Air 2 Liter', target: 'Target: 8 Gelas', completed: true },
        { id: 2, name: 'Jalan Santai Pagi', target: 'Target: 15 Menit', completed: false },
        { id: 3, name: 'Tulis Refleksi Diri', target: 'Target: 1 Catatan', completed: false },
    ]);

    const [selectedMood, setSelectedMood] = useState<number | null>(4);
    const [selectedEmotions, setSelectedEmotions] = useState<string[]>(['Fokus', 'Bersyukur']);

    const toggleHabit = (id: number) => {
        setHabits((prev) =>
            prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
        );
    };

    const toggleEmotion = (emotion: string) => {
        setSelectedEmotions((prev) =>
            prev.includes(emotion)
                ? prev.filter((e) => e !== emotion)
                : [...prev, emotion]
        );
    };

    const completedCount = habits.filter((h) => h.completed).length;
    const progressPercent = Math.round((completedCount / habits.length) * 100);

    const moods = [
        { score: 1, emoji: '😔', label: 'Berat' },
        { score: 2, emoji: '😕', label: 'Cemas' },
        { score: 3, emoji: '😐', label: 'Netral' },
        { score: 4, emoji: '🙂', label: 'Tenang' },
        { score: 5, emoji: '😊', label: 'Penuh Energi' },
    ];

    const emotionPills = ['Fokus', 'Bersyukur', 'Lelah', 'Optimis', 'Reflektif'];

    return (
        <div className="relative mx-auto w-full max-w-md">
            <div className="relative rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-lg shadow-stone-900/5">
                {/* Header status */}
                <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            Live Interactive Demo
                        </div>
                        <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
                            Beranda Harian Anda
                        </h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-medium">
                        Demo Langsung
                    </span>
                </div>

                {/* Section 1: Mood check-in */}
                <div className="pt-4 pb-3">
                    <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-2">
                        1. Bagaimana suasana hati hari ini?
                    </label>
                    <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                        {moods.map((m) => {
                            const isSelected = selectedMood === m.score;
                            return (
                                <button
                                    key={m.score}
                                    type="button"
                                    onClick={() => setSelectedMood(m.score)}
                                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
                                        isSelected
                                            ? 'bg-amber-100/70 dark:bg-amber-900/40 border-2 border-amber-500 scale-105'
                                            : 'bg-stone-50 dark:bg-stone-800/60 border border-transparent hover:bg-stone-100 dark:hover:bg-stone-800'
                                    }`}
                                >
                                    <span className="text-xl mb-0.5">{m.emoji}</span>
                                    <span className="text-[10px] font-medium text-stone-700 dark:text-stone-300">
                                        {m.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Emotion tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {emotionPills.map((emotion) => {
                            const active = selectedEmotions.includes(emotion);
                            return (
                                <button
                                    key={emotion}
                                    type="button"
                                    onClick={() => toggleEmotion(emotion)}
                                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                                        active
                                            ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                                            : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                                    }`}
                                >
                                    {emotion}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Section 2: Habit checklist */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-stone-600 dark:text-stone-400">
                            2. Checklist kebiasaan hari ini:
                        </label>
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                            {progressPercent}% Tuntas
                        </span>
                    </div>

                    <div className="space-y-2">
                        {habits.map((habit) => (
                            <button
                                key={habit.id}
                                type="button"
                                onClick={() => toggleHabit(habit.id)}
                                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                                    habit.completed
                                        ? 'bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-800'
                                        : 'bg-stone-50/60 border-stone-200 dark:bg-stone-800/40 dark:border-stone-700 hover:bg-stone-100/60'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                                            habit.completed
                                                ? 'bg-emerald-600 text-white'
                                                : 'border-2 border-stone-300 dark:border-stone-600'
                                        }`}
                                    >
                                        {habit.completed && (
                                            <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <div
                                            className={`text-xs font-semibold ${
                                                habit.completed
                                                    ? 'line-through text-stone-500 dark:text-stone-400'
                                                    : 'text-stone-900 dark:text-stone-100'
                                            }`}
                                        >
                                            {habit.name}
                                        </div>
                                        <div className="text-[10px] text-stone-500 dark:text-stone-400">
                                            {habit.target}
                                        </div>
                                    </div>
                                </div>

                                {habit.completed && (
                                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                                        +1 Streak
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Instant congratulation footer */}
                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                    <span>Data demo client-side: tersimpan lokal saat mencoba</span>
                    <span className="font-semibold text-stone-700 dark:text-stone-300">Coba klik checklist</span>
                </div>
            </div>
        </div>
    );
}
