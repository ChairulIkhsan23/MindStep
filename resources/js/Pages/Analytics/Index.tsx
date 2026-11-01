import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    Calendar,
    Download,
    Flame,
    Share2,
    Sparkles,
    TrendingUp,
} from 'lucide-react';

export default function AnalyticsIndex() {
    return (
        <AuthenticatedLayout>
            <Head title="Insights & Statistik - MindStep" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-[#EFF6FF] text-[#1D63ED] border border-[#DBEAFE]">
                                Data & Analitika
                            </span>
                        </div>
                        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0F172A]">
                            Insights & Statistik
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
                            Korelasi terukur antara konsistensi kebiasaan dan kesejahteraan emosionalmu.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Link
                            href={route('export.json')}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#0F172A] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] shadow-sm"
                        >
                            <Download className="w-4 h-4 text-[#64748B]" />
                            <span>Ekspor Data</span>
                        </Link>
                    </div>
                </div>

                {/* Key Insight Highlight Banner */}
                <div className="bg-[#1D63ED] text-white p-6 rounded-2xl shadow-md shadow-[#1D63ED]/20 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold">
                            Korelasi Kebiasaan & Mood
                        </span>
                        <Sparkles className="w-4 h-4 text-white/80" />
                    </div>
                    <h3 className="text-lg font-extrabold">
                        Meditasi Pagi Meningkatkan Rata-rata Skor Mood Sebesar 28%
                    </h3>
                    <p className="text-xs text-blue-100 leading-relaxed max-w-2xl">
                        Berdasarkan analisa data 30 hari terakhir, menyelesaikan sesi pernapasan sadar sebelum jam 08:00 WIB berkorelasi langsung dengan minimnya lonjakan stres di sore hari.
                    </p>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
                        <span className="text-xs font-semibold text-[#64748B]">Tingkat Keberhasilan Habit</span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-extrabold text-[#0F172A]">86.4%</span>
                            <span className="text-xs font-bold text-emerald-600 flex items-center">
                                <ArrowUpRight className="w-3.5 h-3.5" /> +5.2%
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-[#64748B]">Bulan Oktober 2024</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
                        <span className="text-xs font-semibold text-[#64748B]">Streak Aktif Terpanjang</span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-extrabold text-[#0F172A]">18 Hari</span>
                            <span className="text-xs font-bold text-[#D97706]">🔥 Rekor Baru</span>
                        </div>
                        <p className="mt-1 text-xs text-[#64748B]">Meditasi & Journaling</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
                        <span className="text-xs font-semibold text-[#64748B]">Rata-rata Skor Emosi</span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-extrabold text-[#0F172A]">4.3 / 5.0</span>
                            <span className="text-xs font-bold text-emerald-600 flex items-center">
                                <ArrowUpRight className="w-3.5 h-3.5" /> +0.4
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-[#64748B]">Kategori dominan: Stabil</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
                        <span className="text-xs font-semibold text-[#64748B]">Total Jam Refleksi</span>
                        <div className="mt-2 flex items-baseline justify-between">
                            <span className="text-2xl font-extrabold text-[#0F172A]">14.5 Jam</span>
                            <span className="text-xs font-bold text-[#1D63ED]">Pagi & Malam</span>
                        </div>
                        <p className="mt-1 text-xs text-[#64748B]">Total 34 sesi terpandu</p>
                    </div>
                </div>

                {/* Habit Distribution & Trends Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
                        <h3 className="text-sm font-extrabold text-[#0F172A]">
                            Distribusi Kategori Habit
                        </h3>
                        <div className="space-y-3">
                            {[
                                { name: 'Kebugaran Pikiran & Meditasi', pct: 95, color: 'bg-[#10B981]' },
                                { name: 'Pengembangan Diri & Baca Buku', pct: 80, color: 'bg-[#1D63ED]' },
                                { name: 'Kesehatan Fisik & Olahraga', pct: 70, color: 'bg-amber-500' },
                                { name: 'Hidrasi & Nutrisi Sehat', pct: 90, color: 'bg-sky-500' },
                            ].map((item, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between text-xs font-semibold">
                                        <span className="text-[#0F172A]">{item.name}</span>
                                        <span className="text-[#64748B]">{item.pct}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${item.color}`}
                                            style={{ width: `${item.pct}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
                        <h3 className="text-sm font-extrabold text-[#0F172A]">
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
                                    <span className="text-[10px] font-bold text-[#1D63ED]">{col.score}</span>
                                    <div
                                        className="w-full bg-[#EFF6FF] hover:bg-[#1D63ED] transition-colors rounded-t-lg"
                                        style={{ height: `${(col.score / 5) * 100}%` }}
                                    />
                                    <span className="text-[11px] font-medium text-[#64748B]">{col.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
