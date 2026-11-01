import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function MoodsIndex() {
    const [selectedScore, setSelectedScore] = useState<number>(4);

    const moodScales = [
        { score: 1, emoji: '😫', label: 'Buruk', desc: 'Sangat tertekan atau down' },
        { score: 2, emoji: '😕', label: 'Kurang Baik', desc: 'Gelisah, cemas, atau lelah' },
        { score: 3, emoji: '😐', label: 'Netral', desc: 'Biasa saja, seimbang' },
        { score: 4, emoji: '😊', label: 'Baik', desc: 'Tenang, bersyukur, lega' },
        { score: 5, emoji: '✨', label: 'Sangat Hebat', desc: 'Bersemangat, penuh energi' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Mood & Emosi - MindStep" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200/90 dark:border-stone-800">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                                Kebugaran Emosional
                            </span>
                        </div>
                        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
                            Mood & Emosi
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                            Kenali dinamika suasana hati harianmu untuk menjaga keseimbangan kesehatan mental.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm shadow-amber-600/20">
                            <Plus className="w-4 h-4" />
                            <span>Catat Mood Baru</span>
                        </button>
                    </div>
                </div>

                {/* Mood Overview Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm">
                        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Rata-rata Mood Pekan Ini</span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">4.4</span>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                                +12% vs pekan lalu
                            </span>
                        </div>
                        <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400">Dominan: Tenang & Bersyukur</p>
                    </div>

                    <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm">
                        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Hari Terstabil</span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">Kamis & Selasa</span>
                        </div>
                        <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400">Skor rata-rata 4.8 / 5.0</p>
                    </div>

                    <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm">
                        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Total Catatan Emosi</span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">28 Log</span>
                        </div>
                        <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400">Konsisten tercatat setiap pagi & malam</p>
                    </div>
                </div>

                {/* Quick Check-in Interactive Box */}
                <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                            Check-in Suasana Hati Cepat
                        </h3>
                        <span className="text-xs text-stone-500 dark:text-stone-400">Hari ini, 24 Oktober 2024</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                        {moodScales.map((item) => (
                            <button
                                key={item.score}
                                onClick={() => setSelectedScore(item.score)}
                                className={`p-4 rounded-2xl border text-center transition-all ${
                                    selectedScore === item.score
                                        ? 'bg-amber-500/10 border-amber-600 ring-2 ring-amber-500/20'
                                        : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800'
                                }`}
                            >
                                <span className="text-3xl block mb-2">{item.emoji}</span>
                                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">{item.label}</h4>
                                <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">{item.desc}</p>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-end pt-2">
                        <button
                            onClick={() => alert('Log mood berhasil disimpan!')}
                            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-colors"
                        >
                            Konfirmasi Catatan Mood
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
