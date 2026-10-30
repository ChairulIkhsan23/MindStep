import { useState } from 'react';

interface HabitItem {
    id: number;
    name: string;
    target: string;
    completed: boolean;
}

const INITIAL_HABITS: HabitItem[] = [
    { id: 1, name: 'Minum Air 2 Liter', target: 'Target: 8 Gelas', completed: true },
    { id: 2, name: 'Jalan Santai Pagi', target: 'Target: 15 Menit', completed: false },
    { id: 3, name: 'Tulis Refleksi Diri', target: 'Target: 1 Catatan', completed: false },
];

export default function HeroInteractiveWidget() {
    const [habits, setHabits] = useState<HabitItem[]>(INITIAL_HABITS);
    const [selectedMood, setSelectedMood] = useState<number>(4);
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

    const resetDemo = () => {
        setHabits(INITIAL_HABITS);
        setSelectedMood(4);
        setSelectedEmotions(['Fokus', 'Bersyukur']);
    };

    const completedCount = habits.filter((h) => h.completed).length;
    const progressPercent = Math.round((completedCount / habits.length) * 100);

    const moods = [
        { score: 1, emoji: '😔', label: 'Berat', reflection: 'Ambil jeda sejenak, satu langkah kecil sudah cukup.' },
        { score: 2, emoji: '😕', label: 'Cemas', reflection: 'Uraikan apa yang bisa dikontrol vs di luar kendali.' },
        { score: 3, emoji: '😐', label: 'Netral', reflection: 'Hari berjalan stabil. Pertahankan ritme dasarmu.' },
        { score: 4, emoji: '🙂', label: 'Tenang', reflection: 'Kondisi jernih untuk menyelesaikan target harian.' },
        { score: 5, emoji: '😊', label: 'Penuh Energi', reflection: 'Manfaatkan momentum baik ini untuk hal bermakna.' },
    ];

    const currentMoodObj = moods.find((m) => m.score === selectedMood) || moods[3];
    const emotionPills = ['Fokus', 'Bersyukur', 'Lelah', 'Optimis', 'Reflektif'];

    return (
        <div className="relative mx-auto w-full max-w-md">
            <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-xl shadow-stone-900/5 transition-all">
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
                    <button
                        type="button"
                        onClick={resetDemo}
                        className="text-xs font-medium text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 px-2.5 py-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        title="Kembalikan nilai demo awal"
                    >
                        Ulang Demo
                    </button>
                </div>

                {/* Section 1: Mood check-in */}
                <div className="pt-4 pb-3">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-stone-600 dark:text-stone-400">
                            1. Suasana hati saat ini:
                        </label>
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                            {currentMoodObj.label}
                        </span>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                        {moods.map((m) => {
                            const isSelected = selectedMood === m.score;
                            return (
                                <button
                                    key={m.score}
                                    type="button"
                                    onClick={() => setSelectedMood(m.score)}
                                    className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all duration-200 active:scale-95 ${
                                        isSelected
                                            ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30 scale-105'
                                            : 'bg-stone-50 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                                    }`}
                                >
                                    <span className="text-xl leading-none mb-1">{m.emoji}</span>
                                    <span
                                        className={`text-[10px] font-medium ${
                                            isSelected ? 'text-white' : 'text-stone-600 dark:text-stone-400'
                                        }`}
                                    >
                                        {m.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Emotion tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                        {emotionPills.map((emotion) => {
                            const active = selectedEmotions.includes(emotion);
                            return (
                                <button
                                    key={emotion}
                                    type="button"
                                    onClick={() => toggleEmotion(emotion)}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-150 active:scale-95 ${
                                        active
                                            ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                                            : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                                    }`}
                                >
                                    {emotion}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Section 2: Habit checklist with animated progress */}
                <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-stone-600 dark:text-stone-400">
                            2. Kebiasaan hari ini:
                        </label>
                        <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                            {completedCount} dari {habits.length} tuntas ({progressPercent}%)
                        </span>
                    </div>

                    {/* Smooth progress bar */}
                    <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden mb-3">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>

                    <div className="space-y-2">
                        {habits.map((habit) => (
                            <button
                                key={habit.id}
                                type="button"
                                onClick={() => toggleHabit(habit.id)}
                                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 active:scale-[0.99] ${
                                    habit.completed
                                        ? 'bg-emerald-50/60 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-800'
                                        : 'bg-stone-50/60 border-stone-200 dark:bg-stone-800/40 dark:border-stone-700 hover:bg-stone-100/60'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 ${
                                            habit.completed
                                                ? 'bg-emerald-600 text-white scale-105'
                                                : 'border-2 border-stone-300 dark:border-stone-600'
                                        }`}
                                    >
                                        <svg
                                            className={`w-3.5 h-3.5 stroke-current stroke-2 fill-none transition-all duration-200 ${
                                                habit.completed ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                                            }`}
                                            viewBox="0 0 24 24"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div
                                            className={`text-xs font-semibold transition-colors duration-200 ${
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

                                <span
                                    className={`text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 transition-all duration-200 ${
                                        habit.completed
                                            ? 'opacity-100 translate-x-0'
                                            : 'opacity-0 translate-x-1 pointer-events-none'
                                    }`}
                                >
                                    +1 Streak
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contextual dynamic reflection snippet */}
                <div className="mt-3.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-800 transition-all duration-300">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                        Refleksi Responsif
                    </div>
                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                        {currentMoodObj.reflection}
                    </p>
                </div>

                {/* Clean client-side note footer */}
                <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                    <span>Interaksi instan di browser</span>
                    <span className="font-semibold text-stone-700 dark:text-stone-300">Coba klik & amati</span>
                </div>
            </div>
        </div>
    );
}
