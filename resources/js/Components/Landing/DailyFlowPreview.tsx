import { useEffect, useState } from 'react';

interface FlowStep {
    id: string;
    time: string;
    phase: string;
    title: string;
    description: string;
    card: {
        badge: string;
        metric: string;
        subtext: string;
        details: Array<{ label: string; value: string; done?: boolean }>;
    };
}

const FLOW_STEPS: FlowStep[] = [
    {
        id: 'morning',
        time: '07:00',
        phase: 'Pagi',
        title: 'Eksekusi & Konsistensi Habit',
        description: 'Tandai progres kebiasaan harian dalam beberapa detik tanpa beban streak kaku.',
        card: {
            badge: 'Habit Engine',
            metric: '3 Target Hari Ini',
            subtext: 'Target harian terkelola rapi',
            details: [
                { label: 'Minum Air 2L', value: '8/8 Gelas', done: true },
                { label: 'Olahraga Pagi', value: '20 Menit', done: true },
                { label: 'Baca Buku', value: '10 Halaman', done: false },
            ],
        },
    },
    {
        id: 'afternoon',
        time: '13:00',
        phase: 'Siang',
        title: 'Check-in Suasana Hati',
        description: 'Catat spektrum emosi saat itu untuk menemukan korelasi dengan produktivitas.',
        card: {
            badge: 'Mood Tracker',
            metric: 'Skor 4.0 / 5.0 (Tenang)',
            subtext: 'Emosi dominan: Fokus & Bersyukur',
            details: [
                { label: 'Tingkat Energi', value: 'Tinggi', done: true },
                { label: 'Tingkat Stres', value: 'Rendah', done: true },
                { label: 'Kondisi Fokus', value: 'Optimal', done: true },
            ],
        },
    },
    {
        id: 'evening',
        time: '21:00',
        phase: 'Malam',
        title: 'Refleksi Terpandu & AI Reflektif',
        description: 'Tutup hari dengan template jurnal terstruktur dan pertanyaan pemantik introspeksi.',
        card: {
            badge: 'Reflective Journaling',
            metric: 'Stoic Evening Review',
            subtext: 'Prompt AI: Apa hal terbaik yang Anda pelajari hari ini?',
            details: [
                { label: 'Hal Dalam Kendali', value: 'Tercatat', done: true },
                { label: 'Pola Emosional', value: 'Tersintesis', done: true },
                { label: 'Draf Dipoles AI', value: 'Siap Simpan', done: true },
            ],
        },
    },
];

export default function DailyFlowPreview() {
    const [activeIdx, setActiveIdx] = useState<number>(0);
    const [isPaused, setIsPaused] = useState<boolean>(false);

    useEffect(() => {
        if (isPaused) {
            return;
        }

        const timer = setInterval(() => {
            setActiveIdx((prev) => (prev + 1) % FLOW_STEPS.length);
        }, 4000);

        return () => clearInterval(timer);
    }, [isPaused]);

    const activeStep = FLOW_STEPS[activeIdx];

    return (
        <div
            className="w-full max-w-lg mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Control Bar: Timeline Phases */}
            <div className="flex items-center justify-between p-1.5 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 mb-4">
                <div className="flex items-center gap-1 w-full">
                    {FLOW_STEPS.map((step, idx) => {
                        const isActive = idx === activeIdx;
                        return (
                            <button
                                key={step.id}
                                type="button"
                                onClick={() => setActiveIdx(idx)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-300 ${
                                    isActive
                                        ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm border border-stone-200/80 dark:border-stone-700'
                                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                                }`}
                            >
                                <span className="text-[10px] opacity-75 font-mono">{step.time}</span>
                                <span>{step.phase}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Showcase Stage Card */}
            <div className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-xl shadow-stone-900/5 transition-all">
                {/* Header Phase Info */}
                <div className="flex items-start justify-between pb-4 border-b border-stone-100 dark:border-stone-800 mb-4">
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            {activeStep.card.badge}
                        </div>
                        <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                            {activeStep.title}
                        </h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                            {activeStep.description}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsPaused((prev) => !prev)}
                        className="text-[11px] font-medium text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 px-2 py-1 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        title={isPaused ? 'Lanjutkan rotasi otomatis' : 'Jeda rotasi otomatis'}
                    >
                        {isPaused ? 'Putar' : 'Jeda'}
                    </button>
                </div>

                {/* Animated Body Preview */}
                <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850/60 border border-stone-200/60 dark:border-stone-800">
                        <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                            {activeStep.card.metric}
                        </div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                            {activeStep.card.subtext}
                        </div>
                    </div>

                    <div className="space-y-2">
                        {activeStep.card.details.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200/60 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span
                                        className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                                            item.done
                                                ? 'bg-emerald-600 text-white'
                                                : 'border border-stone-300 dark:border-stone-600 text-transparent'
                                        }`}
                                    >
                                        ✓
                                    </span>
                                    <span className="font-medium text-stone-800 dark:text-stone-200">
                                        {item.label}
                                    </span>
                                </div>
                                <span className="font-semibold text-stone-600 dark:text-stone-400">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Animated Progress Indicator Bar */}
                <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                    <div className="flex items-center gap-1.5">
                        {FLOW_STEPS.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveIdx(idx)}
                                aria-label={`Pilih tahap ${idx + 1}`}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    idx === activeIdx
                                        ? 'w-8 bg-amber-600 dark:bg-amber-400'
                                        : 'w-2 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300'
                                }`}
                            />
                        ))}
                    </div>
                    <span className="text-[11px]">
                        Siklus terintegrasi 24 jam
                    </span>
                </div>
            </div>
        </div>
    );
}
