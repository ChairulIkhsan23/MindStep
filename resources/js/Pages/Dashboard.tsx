import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    Bookmark,
    BookOpen,
    Calendar as CalendarIcon,
    Check,
    CheckCircle2,
    Clock,
    Flame,
    Lock,
    Minus,
    MoreVertical,
    Moon,
    PenLine,
    Plus,
    RotateCcw,
    Shield,
    Smile,
    Sparkles,
    Sun,
    Tag,
    Target,
    TrendingUp,
    Volume2,
    Zap,
} from 'lucide-react';
import { useState } from 'react';

interface DashboardProps {
    greeting: {
        message: string;
        date_formatted: string;
    };
    habits: {
        summary: {
            total_today: number;
            completed_today: number;
            progress_percent: number;
        };
        items: Array<{
            id: number;
            name: string;
            description: string | null;
            color: string;
            icon: string;
            measurement_type: string;
            target_value: number;
            unit: string | null;
            frequency_type: string;
            today_log: {
                id: number | null;
                current_value: number;
                status: string;
            };
            stats: {
                current_streak: number;
                is_at_risk: boolean;
                level: number;
                level_name: string;
            };
        }>;
    };
    mood: {
        has_logged_today: boolean;
        today_logs: Array<{
            id: number;
            mood_score: number;
            emotions: string[];
            note: string | null;
        }>;
        available_emotions: string[];
    };
    journal: {
        latest_draft: {
            id: number;
            title: string;
            excerpt: string;
            entry_date: string;
            updated_at: string;
        } | null;
        total_published: number;
    };
    mini_insights: {
        weekly_mood_avg: number | null;
        weekly_habit_rate: number;
    };
}

export default function Dashboard({
    greeting,
    habits,
    mood,
    journal,
    mini_insights,
}: DashboardProps) {
    // Quick interactive state for demo / UX richness
    const [selectedTab, setSelectedTab] = useState<'all' | 'morning' | 'evening' | 'quantitative'>('all');
    const [selectedMoodScore, setSelectedMoodScore] = useState<number>(4);
    const [selectedEmotionTag, setSelectedEmotionTag] = useState<string>('Tenang');
    const [quickWaterValue, setQuickWaterValue] = useState<number>(1800);
    const [bookPages, setBookPages] = useState<number>(12);
    const [quickReflection, setQuickReflection] = useState<string>('');

    const moodOptions = [
        { score: 1, emoji: '😫', label: 'Buruk' },
        { score: 2, emoji: '😕', label: 'Kurang' },
        { score: 3, emoji: '😐', label: 'Netral' },
        { score: 4, emoji: '😊', label: 'Baik' },
        { score: 5, emoji: '✨', label: 'Hebat' },
    ];

    const emotionTags = ['Tenang', 'Bersyukur', 'Bersemangat', 'Cemas', 'Lelah'];

    // Habit completion count calculation
    const totalCount = habits?.summary?.total_today > 0 ? habits.summary.total_today : 6;
    const completedCount = habits?.summary?.completed_today > 0 ? habits.summary.completed_today : 4;
    const progressPercent = habits?.summary?.progress_percent > 0 ? habits.summary.progress_percent : 67;

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard - MindStep" />

            <div className="space-y-6 sm:space-y-8">
                {/* 1. Header Greeting Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-[#EFF6FF] text-[#1D63ED] border border-[#DBEAFE]">
                                Hari Ini
                            </span>
                            <span className="text-xs text-[#64748B]">
                                {greeting?.date_formatted || 'Kamis, 24 Oktober 2024'}
                            </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
                                {greeting?.message || 'Selamat Pagi, Sahabat MindStep!'}
                            </h1>
                            <span className="text-2xl sm:text-3xl animate-bounce">👋</span>
                        </div>

                        <p className="mt-1 text-xs sm:text-sm italic text-[#475569]">
                            &ldquo;Satu langkah kecil yang konsisten lebih berharga daripada lompatan besar sesekali.&rdquo;
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                        <Link
                            href={route('habits.index')}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#0F172A] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] shadow-sm transition-colors"
                        >
                            <CalendarIcon className="w-4 h-4 text-[#64748B]" />
                            <span>Atur Target Pekanan</span>
                        </Link>
                        <Link
                            href={route('habits.index')}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#1D63ED] hover:bg-[#1E40AF] shadow-sm shadow-[#1D63ED]/20 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>+ Habit Baru</span>
                        </Link>
                    </div>
                </div>

                {/* 2. Top Metric Cards Row (4 Metric Cards matching reference) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Metric 1: Habit Hari Ini */}
                    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-sm hover:border-[#DBEAFE] hover:shadow-md transition-all">
                        <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
                            <span>Habit Hari Ini</span>
                            <div className="w-6 h-6 rounded-lg bg-[#EFF6FF] text-[#1D63ED] flex items-center justify-center">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="mt-2.5 flex items-baseline justify-between">
                            <div className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">
                                {completedCount} / {totalCount} Selesai
                            </div>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46]">
                                {progressPercent}%
                            </span>
                        </div>
                        <p className="mt-2 text-xs text-[#64748B]">
                            Tersisa {Math.max(0, totalCount - completedCount)} kebiasaan lagi
                        </p>
                    </div>

                    {/* Metric 2: Streak Tertinggi */}
                    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-sm hover:border-[#DBEAFE] hover:shadow-md transition-all">
                        <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
                            <span>Streak Tertinggi</span>
                            <div className="w-6 h-6 rounded-lg bg-[#FFFBEB] text-[#D97706] flex items-center justify-center">
                                <Flame className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="mt-2.5 flex items-baseline gap-2">
                            <span className="text-xl sm:text-2xl font-extrabold text-[#0F172A] flex items-center gap-1">
                                <span className="text-[#F59E0B]">🔥</span> 18 Hari
                            </span>
                        </div>
                        <p className="mt-2 text-xs text-[#64748B]">
                            Konsistensi Tanpa Putus • Rekor: 14 hari
                        </p>
                    </div>

                    {/* Metric 3: Mood Hari Ini */}
                    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-sm hover:border-[#DBEAFE] hover:shadow-md transition-all">
                        <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
                            <span>Mood Hari Ini</span>
                            <div className="w-6 h-6 rounded-lg bg-[#EFF6FF] text-[#1D63ED] flex items-center justify-center">
                                <Smile className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="mt-2.5 flex items-baseline gap-1.5">
                            <span className="text-xl sm:text-2xl font-extrabold text-[#0F172A] flex items-center gap-1.5">
                                😊 Baik <span className="text-sm font-semibold text-[#64748B]">(4/5)</span>
                            </span>
                        </div>
                        <p className="mt-2 text-xs text-[#64748B]">
                            Tenang • Bersyukur • Dicatat 07:15 WIB
                        </p>
                    </div>

                    {/* Metric 4: Jurnal Refleksi */}
                    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-sm hover:border-[#DBEAFE] hover:shadow-md transition-all">
                        <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
                            <span>Jurnal Refleksi</span>
                            <div className="w-6 h-6 rounded-lg bg-[#EFF6FF] text-[#1D63ED] flex items-center justify-center">
                                <BookOpen className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="mt-2.5 flex items-baseline justify-between">
                            <span className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">
                                Tercatat 1
                            </span>
                            <span className="text-[11px] font-bold text-[#1D63ED]">
                                Refleksi Pagi
                            </span>
                        </div>
                        <p className="mt-2 text-xs text-[#64748B]">
                            Jurnal malam siap diisi nanti
                        </p>
                    </div>
                </div>

                {/* 3. Main Split Content (Left 7 cols / Right 5 cols on lg) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                    {/* Left Column (lg:col-span-8): Habits & Quick Journaling */}
                    <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                        {/* A. Habit Hari Ini Card Section */}
                        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8F0]">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-[#1D63ED]" />
                                        <h2 className="text-lg font-extrabold text-[#0F172A]">
                                            Habit Hari Ini
                                        </h2>
                                    </div>
                                    <p className="mt-1 text-xs text-[#64748B]">
                                        Langkah bertahap untuk menjaga fokus dan energi mental Anda
                                    </p>
                                </div>

                                <Link
                                    href={route('habits.index')}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFF6FF] text-[#1D63ED] hover:bg-[#DBEAFE] text-xs font-bold transition-colors shrink-0"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Tambah Habit Baru</span>
                                </Link>
                            </div>

                            {/* Habit Filter Chips */}
                            <div className="flex items-center gap-2 pt-4 pb-2 overflow-x-auto text-xs font-semibold">
                                <button
                                    onClick={() => setSelectedTab('all')}
                                    className={`px-3 py-1.5 rounded-full transition-all shrink-0 ${
                                        selectedTab === 'all'
                                            ? 'bg-[#1D63ED] text-white shadow-sm'
                                            : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                                    }`}
                                >
                                    Semua (6)
                                </button>
                                <button
                                    onClick={() => setSelectedTab('morning')}
                                    className={`px-3 py-1.5 rounded-full transition-all shrink-0 ${
                                        selectedTab === 'morning'
                                            ? 'bg-[#1D63ED] text-white shadow-sm'
                                            : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                                    }`}
                                >
                                    Pagi (3)
                                </button>
                                <button
                                    onClick={() => setSelectedTab('evening')}
                                    className={`px-3 py-1.5 rounded-full transition-all shrink-0 ${
                                        selectedTab === 'evening'
                                            ? 'bg-[#1D63ED] text-white shadow-sm'
                                            : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                                    }`}
                                >
                                    Sore & Malam (3)
                                </button>
                                <button
                                    onClick={() => setSelectedTab('quantitative')}
                                    className={`px-3 py-1.5 rounded-full transition-all shrink-0 ${
                                        selectedTab === 'quantitative'
                                            ? 'bg-[#1D63ED] text-white shadow-sm'
                                            : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                                    }`}
                                >
                                    Target Kuantitatif
                                </button>
                            </div>

                            {/* Habit Cards List */}
                            <div className="space-y-3 mt-3">
                                {/* Habit Item 1: Meditasi Pagi (Completed) */}
                                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#DBEAFE] transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center shrink-0 border border-emerald-100">
                                            <Sun className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="text-sm font-bold text-[#0F172A]">
                                                    Meditasi Pagi & Pernapasan
                                                </h3>
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#ECFDF5] text-[#065F46] flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                                                    Selesai
                                                </span>
                                            </div>
                                            <p className="mt-0.5 text-xs text-[#64748B]">
                                                Durasi: 15 / 15 Menit • Sesi Jam 06:30 WIB
                                            </p>
                                            <div className="mt-1 flex items-center gap-3 text-[11px] text-[#64748B]">
                                                <span className="flex items-center gap-1 font-semibold text-[#D97706]">
                                                    🔥 18 Hari Streak
                                                </span>
                                                <span>•</span>
                                                <span>Kategori: Kebugaran Pikiran</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                        <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700">
                                            100% Tercapai
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-sm">
                                            <Check className="w-4 h-4 stroke-[3]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Habit Item 2: Membaca Buku (Atomic Habits) */}
                                <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#DBEAFE] shadow-sm transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1D63ED] flex items-center justify-center shrink-0 border border-[#DBEAFE]">
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="text-sm font-bold text-[#0F172A]">
                                                    Membaca Buku
                                                </h3>
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F1F5F9] text-[#475569]">
                                                    Atomic Habits
                                                </span>
                                            </div>
                                            <p className="mt-0.5 text-xs text-[#64748B]">
                                                Target: 20 Halaman • <span className="font-bold text-[#1D63ED]">{bookPages} / 20 Halaman (60%)</span>
                                            </p>
                                            <div className="mt-1 flex items-center gap-3 text-[11px] text-[#64748B]">
                                                <span className="flex items-center gap-1 font-semibold text-[#D97706]">
                                                    🔥 12 Hari Streak
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                        <div className="flex items-center border border-[#E2E8F0] rounded-xl overflow-hidden bg-[#F8FAFC]">
                                            <button
                                                onClick={() => setBookPages((p) => Math.max(0, p - 1))}
                                                className="px-2.5 py-1 text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors"
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="px-3 text-xs font-bold text-[#0F172A]">{bookPages}</span>
                                            <button
                                                onClick={() => setBookPages((p) => p + 1)}
                                                className="px-2.5 py-1 text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <button className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#1D63ED] bg-[#EFF6FF] hover:bg-[#DBEAFE] transition-colors">
                                            Catat Selesai
                                        </button>
                                    </div>
                                </div>

                                {/* Habit Item 3: Olahraga Ringan */}
                                <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#DBEAFE] shadow-sm transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                                            <Zap className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="text-sm font-bold text-[#0F172A]">
                                                    Olahraga Ringan
                                                </h3>
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F1F5F9] text-[#64748B]">
                                                    Sore
                                                </span>
                                            </div>
                                            <p className="mt-0.5 text-xs text-[#64748B]">
                                                Target: 30 Menit Kardio Ringan di Taman Kota
                                            </p>
                                            <div className="mt-1 flex items-center gap-3 text-[11px] text-[#64748B]">
                                                <span className="flex items-center gap-1 font-semibold text-[#D97706]">
                                                    🔥 6 Hari Streak
                                                </span>
                                                <span>•</span>
                                                <span className="text-amber-600 font-medium">Belum dimulai hari ini</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                        <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E2E8F0] text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC]">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>Mulai Timer</span>
                                        </button>
                                        <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1D63ED] text-white text-xs font-bold hover:bg-[#1E40AF] transition-colors shadow-sm">
                                            <Check className="w-3.5 h-3.5" />
                                            <span>Tandai Selesai</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Habit Item 4: Minum Air Mineral (Quantitative) */}
                                <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#DBEAFE] shadow-sm transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                                            <span className="text-base">💧</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between sm:justify-start gap-4">
                                                <h3 className="text-sm font-bold text-[#0F172A]">
                                                    Minum Air Mineral
                                                </h3>
                                                <span className="text-xs font-bold text-[#1D63ED]">
                                                    {quickWaterValue} / 2500 ml
                                                </span>
                                            </div>
                                            <div className="w-full sm:w-48 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden mt-1.5">
                                                <div
                                                    className="h-full bg-sky-500 rounded-full transition-all"
                                                    style={{ width: `${Math.min(100, (quickWaterValue / 2500) * 100)}%` }}
                                                />
                                            </div>
                                            <div className="mt-1 flex items-center gap-3 text-[11px] text-[#64748B]">
                                                <span className="flex items-center gap-1 font-semibold text-[#D97706]">
                                                    🔥 15 Hari Streak
                                                </span>
                                                <span>•</span>
                                                <span>Sisa {Math.max(0, 2500 - quickWaterValue)} ml sebelum tidur</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setQuickWaterValue((v) => Math.min(3000, v + 250))}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold transition-colors self-end sm:self-center"
                                    >
                                        <span>+ 250 ml</span>
                                    </button>
                                </div>

                                {/* Habit Item 5: Journaling Malam */}
                                <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#DBEAFE] shadow-sm transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                                            <Moon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-bold text-[#0F172A]">
                                                    Journaling Malam & Evaluasi H...
                                                </h3>
                                                <span className="text-[10px] text-[#64748B]">21:00 WIB</span>
                                            </div>
                                            <p className="mt-0.5 text-xs text-[#64748B]">
                                                Renungkan pencapaian, pelajaran harian, dan set niat esok hari
                                            </p>
                                            <div className="mt-1 flex items-center gap-3 text-[11px] text-[#64748B]">
                                                <span className="flex items-center gap-1 font-semibold text-[#D97706]">
                                                    🔥 18 Hari Streak
                                                </span>
                                                <span>•</span>
                                                <span>Jadwal pengingat aktif</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        href={route('journals.index')}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1D63ED] text-white text-xs font-bold hover:bg-[#1E40AF] transition-colors shadow-sm self-end sm:self-center"
                                    >
                                        <PenLine className="w-3.5 h-3.5" />
                                        <span>Tulis Jurnal</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* B. Journaling & Refleksi Section */}
                        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-sm space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-[#1D63ED]" />
                                        <h2 className="text-lg font-extrabold text-[#0F172A]">
                                            Journaling & Refleksi
                                        </h2>
                                    </div>
                                    <p className="mt-1 text-xs text-[#64748B]">
                                        Ruang aman untuk merefleksikan emosi, pola pikir, dan perkembangan diri Anda
                                    </p>
                                </div>

                                <Link
                                    href={route('journals.index')}
                                    className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] text-xs font-bold text-[#475569] transition-colors"
                                >
                                    Lihat Arsip
                                </Link>
                            </div>

                            {/* Kotak Refleksi Cepat */}
                            <div className="rounded-2xl border border-[#E2E8F0] p-4 bg-[#F8FAFC] space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
                                        <PenLine className="w-3.5 h-3.5 text-[#1D63ED]" />
                                        <span>Kotak Refleksi Cepat</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded-md bg-[#1D63ED] text-white text-[10px] font-bold">
                                            Template: 3 Hal Disyukuri
                                        </span>
                                        <span className="text-xs text-[#64748B] hover:text-[#0F172A] cursor-pointer">
                                            Tulis Bebas
                                        </span>
                                    </div>
                                </div>

                                <textarea
                                    rows={3}
                                    value={quickReflection}
                                    onChange={(e) => setQuickReflection(e.target.value)}
                                    placeholder="Tuliskan 3 hal kecil yang Anda syukuri pagi ini atau catatan kesadaran batin..."
                                    className="w-full p-3 rounded-xl bg-white border border-[#E2E8F0] text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1D63ED] focus:ring-2 focus:ring-[#1D63ED]/15 transition-all resize-none"
                                />

                                <div className="flex items-center justify-between text-xs text-[#64748B]">
                                    <div className="flex items-center gap-2">
                                        <Tag className="w-3.5 h-3.5 hover:text-[#0F172A] cursor-pointer" />
                                        <Lock className="w-3.5 h-3.5 text-[#64748B]" />
                                        <span className="text-[11px]">Enkripsi privat end-to-end</span>
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (quickReflection.trim()) {
                                                alert('Refleksi cepat tersimpan!');
                                                setQuickReflection('');
                                            }
                                        }}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1D63ED] text-white font-bold text-xs hover:bg-[#1E40AF] transition-colors shadow-sm"
                                    >
                                        <PenLine className="w-3.5 h-3.5" />
                                        <span>Simpan Refleksi</span>
                                    </button>
                                </div>
                            </div>

                            {/* Refleksi Unggulan Terakhir */}
                            <div className="rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 bg-white hover:border-[#DBEAFE] shadow-sm transition-all space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                                            Mood: Baik (4/5)
                                        </span>
                                        <span className="text-[#64748B] text-[11px]">
                                            Pagi Ini • 08:30 WIB
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[#64748B]">
                                        <Bookmark className="w-3.5 h-3.5 hover:text-[#0F172A] cursor-pointer" />
                                        <MoreVertical className="w-3.5 h-3.5 hover:text-[#0F172A] cursor-pointer" />
                                    </div>
                                </div>

                                <h3 className="text-base font-bold text-[#0F172A]">
                                    Refleksi Progres Proyek dan Ketenangan Batin
                                </h3>

                                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                                    &ldquo;Hari ini berhasil menuntaskan modul utama tanpa terdistraksi media sosial. Menyadari bahwa memulai adalah bagian tersulit, namun setelah 5 menit pertama pernapasan sadar, fokus mengalir alami. Saya bersyukur atas kopi...&rdquo;
                                </p>

                                <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                                    <span className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] font-medium">#Bersyukur</span>
                                    <span className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] font-medium">#Fokus</span>
                                    <span className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] font-medium">#PengembanganDiri</span>
                                </div>

                                <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                                    <Link
                                        href={route('journals.index')}
                                        className="font-bold text-[#1D63ED] hover:underline flex items-center gap-1"
                                    >
                                        <span>Lihat Selengkapnya</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                    <div className="flex items-center gap-3">
                                        <button className="text-[#64748B] hover:text-[#0F172A] font-semibold flex items-center gap-1">
                                            <PenLine className="w-3 h-3" />
                                            <span>Edit</span>
                                        </button>
                                        <button className="text-[#1D63ED] font-semibold flex items-center gap-1 hover:underline">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            <span>Minta Ringkasan AI</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (lg:col-span-4): Mood Logger, AI Coach, Calendar Heatmap */}
                    <div className="lg:col-span-4 space-y-6 sm:space-y-8">
                        {/* 1. Pencatat Mood & Emosi Card */}
                        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Smile className="w-5 h-5 text-[#1D63ED]" />
                                    <h3 className="text-base font-extrabold text-[#0F172A]">
                                        Pencatat Mood & Emosi
                                    </h3>
                                </div>
                                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                                    Sore Ini
                                </span>
                            </div>

                            <p className="text-xs text-[#64748B] leading-relaxed">
                                Bagaimana perasaan Anda saat ini? Luangkan waktu sejenak untuk mengenali rasa.
                            </p>

                            {/* 5 Emojis Selector */}
                            <div className="grid grid-cols-5 gap-1.5 pt-1">
                                {moodOptions.map((opt) => (
                                    <button
                                        key={opt.score}
                                        onClick={() => setSelectedMoodScore(opt.score)}
                                        className={`flex flex-col items-center p-2 rounded-xl border transition-all ${
                                            selectedMoodScore === opt.score
                                                ? 'bg-[#EFF6FF] border-[#1D63ED] shadow-sm scale-105'
                                                : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                                        }`}
                                    >
                                        <span className="text-xl sm:text-2xl">{opt.emoji}</span>
                                        <span className="mt-1 text-[10px] font-bold text-[#0F172A]">{opt.score}</span>
                                        <span className="text-[9px] text-[#64748B] truncate max-w-full">{opt.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Label Emosi Dominan */}
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
                                    Label Emosi Dominan
                                </label>
                                <div className="flex flex-wrap gap-1.5 text-xs">
                                    {emotionTags.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => setSelectedEmotionTag(tag)}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                                selectedEmotionTag === tag
                                                    ? 'bg-[#1D63ED] text-white shadow-sm'
                                                    : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                                            }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                    <button className="px-2 py-1 rounded-lg text-xs font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]">
                                        + Tambah Label
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => alert('Log mood berhasil disimpan!')}
                                className="w-full py-2.5 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1D63ED] font-bold text-xs transition-colors"
                            >
                                Simpan Log Mood Sore
                            </button>
                        </div>

                        {/* 2. MindStep AI Coach Banner (Vibrant Royal Blue) */}
                        <div className="bg-[#1D63ED] text-white rounded-2xl p-5 sm:p-6 shadow-md shadow-[#1D63ED]/25 space-y-3.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-sm text-[11px] font-bold">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>MindStep AI Coach</span>
                                </span>
                                <Sparkles className="w-4 h-4 text-white/70" />
                            </div>

                            <h3 className="text-base font-extrabold tracking-tight">
                                Pola Positif Terdeteksi Pekan Ini!
                            </h3>

                            <p className="text-xs text-blue-100 leading-relaxed">
                                Pada hari-hari di mana Anda menuntaskan <strong className="text-white">&apos;Meditasi Pagi&apos;</strong>, skor mood Anda rata-rata <strong className="text-white">4.4/5</strong> (28% lebih tinggi dibanding hari tanpa meditasi).
                            </p>

                            <p className="text-[11px] italic text-blue-200">
                                &ldquo;Ingin mengambil jeda 3 menit refleksi terpandu untuk mengunci pencapaian ini?&rdquo;
                            </p>

                            <div className="pt-2">
                                <Link
                                    href={route('ai-assistant.index')}
                                    className="w-full inline-flex items-center justify-center py-2.5 rounded-xl bg-white text-[#1D63ED] font-bold text-xs hover:bg-blue-50 transition-colors shadow-sm"
                                >
                                    Jelajahi Refleksi AI
                                </Link>
                            </div>

                            <div className="pt-1 flex items-center justify-between text-[10px] text-blue-200 border-t border-white/10">
                                <span className="flex items-center gap-1">
                                    <Lock className="w-3 h-3" />
                                    <span>Data terenkripsi privat</span>
                                </span>
                                <span className="hover:underline cursor-pointer">Set Privasi AI</span>
                            </div>
                        </div>

                        {/* 3. Konsistensi Oktober 2024 (Calendar Heatmap) */}
                        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-5 h-5 text-[#1D63ED]" />
                                    <div>
                                        <h3 className="text-sm font-extrabold text-[#0F172A]">
                                            Konsistensi
                                        </h3>
                                        <p className="text-xs text-[#64748B]">Oktober 2024</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                                        <Flame className="w-3.5 h-3.5 text-[#F59E0B]" /> 18 Hari
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs text-[#64748B] leading-relaxed">
                                Matriks komitmen harian. 7 hari terakhir diselesaikan dengan tingkat keberhasilan 94%.
                            </p>

                            {/* Calendar Days Matrix */}
                            <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                                {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
                                    <span key={day} className="text-[10px] font-bold text-[#94A3B8] pb-1">
                                        {day}
                                    </span>
                                ))}

                                {/* Example Month Matrix corresponding to reference image */}
                                <div className="p-1 rounded-lg bg-[#F8FAFC] text-[#94A3B8] text-[11px]">30</div>
                                <div className="p-1 rounded-lg bg-blue-100 text-[#1D63ED] font-bold text-[11px]">1</div>
                                <div className="p-1 rounded-lg bg-blue-300 text-white font-bold text-[11px]">2</div>
                                <div className="p-1 rounded-lg bg-[#1D63ED] text-white font-bold text-[11px]">3</div>
                                <div className="p-1 rounded-lg bg-[#1D63ED] text-white font-bold text-[11px]">4</div>
                                <div className="p-1 rounded-lg bg-[#1D63ED] text-white font-bold text-[11px]">5</div>
                                <div className="p-1 rounded-lg bg-[#1D63ED] text-white font-bold text-[11px]">6</div>

                                <div className="p-1 rounded-lg bg-[#1D63ED] text-white font-bold text-[11px]">7</div>
                                <div className="p-1 rounded-lg bg-[#1D63ED] text-white font-bold text-[11px]">8</div>
                                <div className="p-1 rounded-lg bg-[#1D63ED] text-white font-bold text-[11px]">9</div>
                                <div className="p-1 rounded-lg bg-[#1D63ED] text-white font-bold text-[11px]">10</div>
                                <div className="p-1 rounded-lg bg-blue-200 text-[#1D63ED] font-bold text-[11px]">11</div>
                                <div className="p-1 rounded-lg bg-[#1D63ED] text-white font-bold text-[11px]">12</div>
                                <div className="p-1 rounded-lg bg-[#1D63ED] text-white font-bold text-[11px]">13</div>

                                <div className="p-1 rounded-lg bg-[#1D63ED] text-white font-bold text-[11px]">14</div>
                                <div className="p-1 rounded-lg bg-[#1D63ED] text-white font-bold text-[11px]">15</div>
                                <div className="p-1 rounded-lg bg-[#1D63ED] text-white font-bold text-[11px]">16</div>
                                <div className="p-1 rounded-lg bg-[#1D63ED] text-white font-bold text-[11px]">17</div>
                                <div className="p-1 rounded-lg bg-[#1D63ED] text-white font-bold text-[11px]">18</div>
                                <div className="p-1 rounded-lg bg-[#1D63ED] text-white font-bold text-[11px]">19</div>
                                <div className="p-1 rounded-lg bg-[#1D63ED] text-white font-bold text-[11px]">20</div>

                                <div className="p-1 rounded-lg bg-[#1D63ED] text-white font-bold text-[11px]">21</div>
                                <div className="p-1 rounded-lg bg-[#1D63ED] text-white font-bold text-[11px]">22</div>
                                <div className="p-1 rounded-lg bg-[#1D63ED] text-white font-bold text-[11px]">23</div>
                                <div className="p-1 rounded-lg bg-[#1D63ED] text-white font-bold text-[11px]">24</div>
                                <div className="p-1 rounded-lg bg-[#F1F5F9] text-[#94A3B8] text-[11px]">25</div>
                                <div className="p-1 rounded-lg bg-[#F1F5F9] text-[#94A3B8] text-[11px]">26</div>
                                <div className="p-1 rounded-lg bg-[#F1F5F9] text-[#94A3B8] text-[11px]">27</div>
                            </div>

                            {/* Legend */}
                            <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
                                <div className="flex items-center gap-1.5 font-bold text-emerald-600">
                                    <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                                    <span>7 hari tanpa jeda</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px]">
                                    <span>Rendah</span>
                                    <div className="flex items-center gap-0.5">
                                        <span className="w-2 h-2 rounded bg-blue-100" />
                                        <span className="w-2 h-2 rounded bg-blue-300" />
                                        <span className="w-2 h-2 rounded bg-[#1D63ED]" />
                                    </div>
                                    <span>Penuh</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
