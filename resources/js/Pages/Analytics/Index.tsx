import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    Download,
    Sparkles,
} from 'lucide-react';

export default function AnalyticsIndex() {
    return (
        <AuthenticatedLayout>
            <Head title="Insights & Statistik - MindStep" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200/90 dark:border-stone-800">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                                Data & Analitika
                            </span>
                        </div>
                        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
                            Insights & Statistik
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                            Korelasi terukur antara konsistensi kebiasaan dan kesejahteraan emosionalmu.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Link
                            href={route('export.json')}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-850 shadow-sm"
                        >
                            <Download className="w-4 h-4 text-stone-400" />
                            <span>Ekspor Data</span>
                        </Link>
                    </div>
                </div>

                {/* Key Insight Highlight Banner */}
                <div className="relative bg-stone-900 text-white p-6 rounded-2xl border border-stone-800 shadow-md space-y-3 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600/15 via-rose-600/10 to-amber-600/15 -z-10" />

                    <div className="flex items-center justify-between text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-[11px] font-bold text-amber-400">
                            Korelasi Kebiasaan & Mood
                        </span>
                        <Sparkles className="w-4 h-4 text-amber-400" />
                    </div>
                    <h3 className="text-lg font-extrabold">
                        Meditasi Pagi Meningkatkan Rata-rata Skor Mood Sebesar 28%
                    </h3>
                    <p className="text-xs text-stone-300 leading-relaxed max-w-2xl">
                        Berdasarkan analisa data 30 hari terakhir, menyelesaikan sesi pernapasan sadar sebelum jam 08:00 WIB berkorelasi langsung dengan minimnya lonjakan stres di sore hari.
                    </p>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm">
                        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Tingkat Keberhasilan Habit</span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">86.4%</span>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                                <ArrowUpRight className="w-3.5 h-3.5" /> +5.2%
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Bulan Oktober 2024</p>
                    </div>

                    <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm">
                        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Streak Aktif Terpanjang</span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">18 Hari</span>
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">🔥 Rekor Baru</span>
                        </div>
                        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Meditasi & Journaling</p>
                    </div>

                    <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm">
                        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Rata-rata Skor Emosi</span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">4.3 / 5.0</span>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                                <ArrowUpRight className="w-3.5 h-3.5" /> +0.4
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Kategori dominan: Stabil</p>
                    </div>

                    <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm">
                        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Total Jam Refleksi</span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">14.5 Jam</span>
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Pagi & Malam</span>
                        </div>
                        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Total 34 sesi terpandu</p>
                    </div>
                </div>

                {/* Habit Distribution & Trends Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm space-y-4">
                        <h3 className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
                            Distribusi Kategori Habit
                        </h3>
                        <div className="space-y-3">
                            {[
                                { name: 'Kebugaran Pikiran & Meditasi', pct: 95, color: 'bg-emerald-500' },
                                { name: 'Pengembangan Diri & Baca Buku', pct: 80, color: 'bg-amber-600' },
                                { name: 'Kesehatan Fisik & Olahraga', pct: 70, color: 'bg-rose-500' },
                                { name: 'Hidrasi & Nutrisi Sehat', pct: 90, color: 'bg-sky-500' },
                            ].map((item, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between text-xs font-semibold">
                                        <span className="text-stone-900 dark:text-stone-100">{item.name}</span>
                                        <span className="text-stone-500 dark:text-stone-400">{item.pct}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${item.color}`}
                                            style={{ width: `${item.pct}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm space-y-4">
                        <h3 className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
                            Pola Emosi Mingguan
                        </h3>
                        <div className="h-44 flex items-end justify-between gap-2 pt-6">
                            {[
                                { day: 'Sen', score: 3.5 },
                                { day: 'Sel', score: 4.8 },
                                { day: 'Rab', score: 4.0 },
                                { day: 'Kam', score: 4.9 },
                                { day: 'Jum', score: 4.5 },
                                { day: 'Sab', score: 4.7 },
                                { day: 'Min', score: 4.6 },
                            ].map((col, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">{col.score}</span>
                                    <div
                                        className="w-full bg-amber-100 dark:bg-amber-950/40 hover:bg-amber-500 dark:hover:bg-amber-500 transition-colors rounded-t-lg"
                                        style={{ height: `${(col.score / 5) * 100}%` }}
                                    />
                                    <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">{col.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
