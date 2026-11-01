import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Bookmark,
    BookOpen,
    Calendar as CalendarIcon,
    Check,
    CheckCircle2,
    Clock,
    Flame,
    Lock,
    Minus,
    Moon,
    MoreVertical,
    PenLine,
    Plus,
    Smile,
    Sparkles,
    Sun,
    Tag,
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
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                                Hari Ini
                            </span>
                            <span className="text-xs text-stone-500 dark:text-stone-400">
                                {greeting?.date_formatted || 'Kamis, 24 Oktober 2024'}
                            </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
                                {greeting?.message || 'Selamat Pagi, Sahabat MindStep!'}
                            </h1>
                            <span className="text-2xl sm:text-3xl animate-bounce">👋</span>
                        </div>

                        <p className="mt-1 text-xs sm:text-sm italic text-stone-600 dark:text-stone-400">
                            &ldquo;Satu langkah kecil yang konsisten lebih berharga daripada lompatan besar sesekali.&rdquo;
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                        <Link
                            href={route('habits.index')}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-850 shadow-sm transition-colors"
                        >
                            <CalendarIcon className="w-4 h-4 text-stone-400" />
                            <span>Atur Target Pekanan</span>
                        </Link>
                        <Link
                            href={route('habits.index')}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 shadow-sm shadow-amber-600/20 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>+ Habit Baru</span>
                        </Link>
                    </div>
                </div>

                {/* 2. Top Metric Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Metric 1 */}
                    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-4 sm:p-5 shadow-sm hover:border-amber-300 dark:hover:border-amber-800/80 transition-all">
                        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
                            <span>Habit Hari Ini</span>
                            <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="mt-2.5 flex items-baseline justify-between">
                            <div className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100">
                                {completedCount} / {totalCount} Selesai
                            </div>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                                {progressPercent}%
                            </span>
                        </div>
                        <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
                            Tersisa {Math.max(0, totalCount - completedCount)} kebiasaan lagi
                        </p>
                    </div>

                    {/* Metric 2 */}
                    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-4 sm:p-5 shadow-sm hover:border-amber-300 dark:hover:border-amber-800/80 transition-all">
                        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
                            <span>Streak Tertinggi</span>
                            <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                <Flame className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="mt-2.5 flex items-baseline gap-2">
                            <span className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-1">
                                <span className="text-amber-600 dark:text-amber-400">🔥</span> 18 Hari
                            </span>
                        </div>
                        <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
                            Konsistensi Tanpa Putus • Rekor: 14 hari
                        </p>
                    </div>

                    {/* Metric 3 */}
                    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-4 sm:p-5 shadow-sm hover:border-amber-300 dark:hover:border-amber-800/80 transition-all">
                        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
                            <span>Mood Hari Ini</span>
                            <div className="w-6 h-6 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                                <Smile className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="mt-2.5 flex items-baseline gap-1.5">
                            <span className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                                😊 Baik <span className="text-sm font-semibold text-stone-500 dark:text-stone-400">(4/5)</span>
                            </span>
                        </div>
                        <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
                            Tenang • Bersyukur • Dicatat 07:15 WIB
                        </p>
                    </div>

                    {/* Metric 4 */}
                    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-4 sm:p-5 shadow-sm hover:border-amber-300 dark:hover:border-amber-800/80 transition-all">
                        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
                            <span>Jurnal Refleksi</span>
                            <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                <BookOpen className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="mt-2.5 flex items-baseline justify-between">
                            <span className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100">
                                Tercatat 1
                            </span>
                            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                                Refleksi Pagi
                            </span>
                        </div>
                        <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
                            Jurnal malam siap diisi nanti
                        </p>
                    </div>
                </div>

                {/* 3. Main Split Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                        {/* A. Habit Hari Ini Card Section */}
                        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-5 sm:p-6 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200/90 dark:border-stone-800">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        <h2 className="text-lg font-extrabold text-stone-900 dark:text-stone-100">
                                            Habit Hari Ini
                                        </h2>
                                    </div>
                                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                                        Langkah bertahap untuk menjaga fokus dan energi mental Anda
                                    </p>
                                </div>

                                <Link
                                    href={route('habits.index')}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition-colors shrink-0"
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
                                            ? 'bg-amber-600 text-white shadow-sm'
                                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                                    }`}
                                >
                                    Semua (6)
                                </button>
                                <button
                                    onClick={() => setSelectedTab('morning')}
                                    className={`px-3 py-1.5 rounded-full transition-all shrink-0 ${
                                        selectedTab === 'morning'
                                            ? 'bg-amber-600 text-white shadow-sm'
                                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                                    }`}
                                >
                                    Pagi (3)
                                </button>
                                <button
                                    onClick={() => setSelectedTab('evening')}
                                    className={`px-3 py-1.5 rounded-full transition-all shrink-0 ${
                                        selectedTab === 'evening'
                                            ? 'bg-amber-600 text-white shadow-sm'
                                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                                    }`}
                                >
                                    Sore & Malam (3)
                                </button>
                                <button
                                    onClick={() => setSelectedTab('quantitative')}
                                    className={`px-3 py-1.5 rounded-full transition-all shrink-0 ${
                                        selectedTab === 'quantitative'
                                            ? 'bg-amber-600 text-white shadow-sm'
                                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                                    }`}
                                >
                                    Target Kuantitatif
                                </button>
                            </div>

                            {/* Habit Cards List */}
                            <div className="space-y-3 mt-3">
                                {/* Habit 1: Meditasi Pagi */}
                                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/90 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-300 dark:hover:border-amber-800/80 transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
                                            <Sun className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                                                    Meditasi Pagi & Pernapasan
                                                </h3>
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    Selesai
                                                </span>
                                            </div>
                                            <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                                                Durasi: 15 / 15 Menit • Sesi Jam 06:30 WIB
                                            </p>
                                            <div className="mt-1 flex items-center gap-3 text-[11px] text-stone-500 dark:text-stone-400">
                                                <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                                                    🔥 18 Hari Streak
                                                </span>
                                                <span>•</span>
                                                <span>Kategori: Kebugaran Pikiran</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                        <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                                            100% Tercapai
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                                            <Check className="w-4 h-4 stroke-[3]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Habit 2: Membaca Buku */}
                                <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-300 dark:hover:border-amber-800/80 shadow-sm transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                                                    Membaca Buku
                                                </h3>
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                                                    Atomic Habits
                                                </span>
                                            </div>
                                            <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                                                Target: 20 Halaman • <span className="font-bold text-amber-600 dark:text-amber-400">{bookPages} / 20 Halaman (60%)</span>
                                            </p>
                                            <div className="mt-1 flex items-center gap-3 text-[11px] text-stone-500 dark:text-stone-400">
                                                <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                                                    🔥 12 Hari Streak
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                        <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden bg-stone-50 dark:bg-stone-850">
                                            <button
                                                onClick={() => setBookPages((p) => Math.max(0, p - 1))}
                                                className="px-2.5 py-1 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="px-3 text-xs font-bold text-stone-900 dark:text-stone-100">{bookPages}</span>
                                            <button
                                                onClick={() => setBookPages((p) => p + 1)}
                                                className="px-2.5 py-1 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <button className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-colors">
                                            Catat Selesai
                                        </button>
                                    </div>
                                </div>

                                {/* Habit 3: Olahraga Ringan */}
                                <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-300 dark:hover:border-amber-800/80 shadow-sm transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-800">
                                            <Zap className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                                                    Olahraga Ringan
                                                </h3>
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                                                    Sore
                                                </span>
                                            </div>
                                            <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                                                Target: 30 Menit Kardio Ringan di Taman Kota
                                            </p>
                                            <div className="mt-1 flex items-center gap-3 text-[11px] text-stone-500 dark:text-stone-400">
                                                <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                                                    🔥 6 Hari Streak
                                                </span>
                                                <span>•</span>
                                                <span className="text-amber-700 dark:text-amber-400 font-medium">Belum dimulai hari ini</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                        <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>Mulai Timer</span>
                                        </button>
                                        <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold transition-colors shadow-sm">
                                            <Check className="w-3.5 h-3.5" />
                                            <span>Tandai Selesai</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Habit 4: Minum Air Mineral */}
                                <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-300 dark:hover:border-amber-800/80 shadow-sm transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-200 dark:border-sky-800">
                                            <span className="text-base">💧</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between sm:justify-start gap-4">
                                                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                                                    Minum Air Mineral
                                                </h3>
                                                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                                                    {quickWaterValue} / 2500 ml
                                                </span>
                                            </div>
                                            <div className="w-full sm:w-48 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-1.5">
                                                <div
                                                    className="h-full bg-amber-500 rounded-full transition-all"
                                                    style={{ width: `${Math.min(100, (quickWaterValue / 2500) * 100)}%` }}
                                                />
                                            </div>
                                            <div className="mt-1 flex items-center gap-3 text-[11px] text-stone-500 dark:text-stone-400">
                                                <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                                                    🔥 15 Hari Streak
                                                </span>
                                                <span>•</span>
                                                <span>Sisa {Math.max(0, 2500 - quickWaterValue)} ml sebelum tidur</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setQuickWaterValue((v) => Math.min(3000, v + 250))}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold transition-colors self-end sm:self-center"
                                    >
                                        <span>+ 250 ml</span>
                                    </button>
                                </div>

                                {/* Habit 5: Journaling Malam */}
                                <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-300 dark:hover:border-amber-800/80 shadow-sm transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center shrink-0 border border-stone-200 dark:border-stone-700">
                                            <Moon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                                                    Journaling Malam & Evaluasi H...
                                                </h3>
                                                <span className="text-[10px] text-stone-500 dark:text-stone-400">21:00 WIB</span>
                                            </div>
                                            <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                                                Renungkan pencapaian, pelajaran harian, dan set niat esok hari
                                            </p>
                                            <div className="mt-1 flex items-center gap-3 text-[11px] text-stone-500 dark:text-stone-400">
                                                <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                                                    🔥 18 Hari Streak
                                                </span>
                                                <span>•</span>
                                                <span>Jadwal pengingat aktif</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        href={route('journals.index')}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-sm self-end sm:self-center"
                                    >
                                        <PenLine className="w-3.5 h-3.5" />
                                        <span>Tulis Jurnal</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* B. Journaling & Refleksi Section */}
                        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-5 sm:p-6 shadow-sm space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-stone-200/90 dark:border-stone-800">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        <h2 className="text-lg font-extrabold text-stone-900 dark:text-stone-100">
                                            Journaling & Refleksi
                                        </h2>
                                    </div>
                                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                                        Ruang aman untuk merefleksikan emosi, pola pikir, dan perkembangan diri Anda
                                    </p>
                                </div>

                                <Link
                                    href={route('journals.index')}
                                    className="px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300 transition-colors"
                                >
                                    Lihat Arsip
                                </Link>
                            </div>

                            {/* Kotak Refleksi Cepat */}
                            <div className="rounded-2xl border border-stone-200/90 dark:border-stone-800 p-4 bg-stone-50 dark:bg-stone-850 space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-stone-100">
                                        <PenLine className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                        <span>Kotak Refleksi Cepat</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded-md bg-amber-600 text-white text-[10px] font-bold">
                                            Template: 3 Hal Disyukuri
                                        </span>
                                        <span className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer">
                                            Tulis Bebas
                                        </span>
                                    </div>
                                </div>

                                <textarea
                                    rows={3}
                                    value={quickReflection}
                                    onChange={(e) => setQuickReflection(e.target.value)}
                                    placeholder="Tuliskan 3 hal kecil yang Anda syukuri pagi ini atau catatan kesadaran batin..."
                                    className="w-full p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                                />

                                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                                    <div className="flex items-center gap-2">
                                        <Tag className="w-3.5 h-3.5 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer" />
                                        <Lock className="w-3.5 h-3.5 text-stone-400" />
                                        <span className="text-[11px]">Enkripsi privat end-to-end</span>
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (quickReflection.trim()) {
                                                alert('Refleksi cepat tersimpan!');
                                                setQuickReflection('');
                                            }
                                        }}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors shadow-sm"
                                    >
                                        <PenLine className="w-3.5 h-3.5" />
                                        <span>Simpan Refleksi</span>
                                    </button>
                                </div>
                            </div>

                            {/* Refleksi Unggulan Terakhir */}
                            <div className="rounded-2xl border border-stone-200/90 dark:border-stone-800 p-4 sm:p-5 bg-white dark:bg-stone-900 hover:border-amber-300 dark:hover:border-amber-800/80 shadow-sm transition-all space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-[11px]">
                                            Mood: Baik (4/5)
                                        </span>
                                        <span className="text-stone-500 dark:text-stone-400 text-[11px]">
                                            Pagi Ini • 08:30 WIB
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-stone-400">
                                        <Bookmark className="w-3.5 h-3.5 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer" />
                                        <MoreVertical className="w-3.5 h-3.5 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer" />
                                    </div>
                                </div>

                                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                                    Refleksi Progres Proyek dan Ketenangan Batin
                                </h3>

                                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                                    &ldquo;Hari ini berhasil menuntaskan modul utama tanpa terdistraksi media sosial. Menyadari bahwa memulai adalah bagian tersulit, namun setelah 5 menit pertama pernapasan sadar, fokus mengalir alami. Saya bersyukur atas kopi...&rdquo;
                                </p>

                                <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                                    <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">#Bersyukur</span>
                                    <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">#Fokus</span>
                                    <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">#PengembanganDiri</span>
                                </div>

                                <div className="pt-2 border-t border-stone-200/90 dark:border-stone-800 flex items-center justify-between text-xs">
                                    <Link
                                        href={route('journals.index')}
                                        className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                                    >
                                        <span>Lihat Selengkapnya</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                    <div className="flex items-center gap-3">
                                        <button className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 font-semibold flex items-center gap-1">
                                            <PenLine className="w-3 h-3" />
                                            <span>Edit</span>
                                        </button>
                                        <button className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 hover:underline">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            <span>Minta Ringkasan AI</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-4 space-y-6 sm:space-y-8">
                        {/* 1. Pencatat Mood & Emosi Card */}
                        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-5 sm:p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Smile className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    <h3 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                                        Pencatat Mood & Emosi
                                    </h3>
                                </div>
                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                                    Sore Ini
                                </span>
                            </div>

                            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
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
                                                ? 'bg-amber-500/10 border-amber-600 text-amber-700 dark:text-amber-400 shadow-sm scale-105'
                                                : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800'
                                        }`}
                                    >
                                        <span className="text-xl sm:text-2xl">{opt.emoji}</span>
                                        <span className="mt-1 text-[10px] font-bold text-stone-900 dark:text-stone-100">{opt.score}</span>
                                        <span className="text-[9px] text-stone-500 dark:text-stone-400 truncate max-w-full">{opt.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Label Emosi Dominan */}
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
                                    Label Emosi Dominan
                                </label>
                                <div className="flex flex-wrap gap-1.5 text-xs">
                                    {emotionTags.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => setSelectedEmotionTag(tag)}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                                selectedEmotionTag === tag
                                                    ? 'bg-amber-600 text-white shadow-sm'
                                                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                                            }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                    <button className="px-2 py-1 rounded-lg text-xs font-semibold border border-stone-200 dark:border-stone-800 text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-850">
                                        + Tambah Label
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => alert('Log mood berhasil disimpan!')}
                                className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold text-xs transition-colors"
                            >
                                Simpan Log Mood Sore
                            </button>
                        </div>

                        {/* 2. MindStep AI Coach Banner (MindStep Stone & Warm Accent Card) */}
                        <div className="relative rounded-2xl p-5 sm:p-6 bg-stone-900 text-white border border-stone-800 shadow-md space-y-3.5 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/15 via-rose-600/10 to-amber-600/15 -z-10" />

                            <div className="flex items-center justify-between text-xs">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-[11px] font-bold text-amber-400">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>MindStep AI Coach</span>
                                </span>
                                <Sparkles className="w-4 h-4 text-amber-400" />
                            </div>

                            <h3 className="text-base font-extrabold tracking-tight text-white">
                                Pola Positif Terdeteksi Pekan Ini!
                            </h3>

                            <p className="text-xs text-stone-300 leading-relaxed">
                                Pada hari-hari di mana Anda menuntaskan <strong className="text-white">&apos;Meditasi Pagi&apos;</strong>, skor mood Anda rata-rata <strong className="text-amber-400">4.4/5</strong> (28% lebih tinggi dibanding hari tanpa meditasi).
                            </p>

                            <p className="text-[11px] italic text-stone-400">
                                &ldquo;Ingin mengambil jeda 3 menit refleksi terpandu untuk mengunci pencapaian ini?&rdquo;
                            </p>

                            <div className="pt-2">
                                <Link
                                    href={route('ai-assistant.index')}
                                    className="w-full inline-flex items-center justify-center py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors shadow-sm"
                                >
                                    Jelajahi Refleksi AI
                                </Link>
                            </div>

                            <div className="pt-1 flex items-center justify-between text-[10px] text-stone-400 border-t border-stone-800">
                                <span className="flex items-center gap-1">
                                    <Lock className="w-3 h-3" />
                                    <span>Data terenkripsi privat</span>
                                </span>
                                <span className="hover:underline cursor-pointer">Set Privasi AI</span>
                            </div>
                        </div>

                        {/* 3. Konsistensi Kalender Heatmap */}
                        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-5 sm:p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    <div>
                                        <h3 className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
                                            Konsistensi
                                        </h3>
                                        <p className="text-xs text-stone-500 dark:text-stone-400">Oktober 2024</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1">
                                        <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> 18 Hari
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                                Matriks komitmen harian. 7 hari terakhir diselesaikan dengan tingkat keberhasilan 94%.
                            </p>

                            {/* Calendar Days Matrix */}
                            <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                                {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
                                    <span key={day} className="text-[10px] font-bold text-stone-400 pb-1">
                                        {day}
                                    </span>
                                ))}

                                <div className="p-1 rounded-lg bg-stone-100 dark:bg-stone-850 text-stone-400 text-[11px]">30</div>
                                <div className="p-1 rounded-lg bg-amber-100 text-amber-700 font-bold text-[11px]">1</div>
                                <div className="p-1 rounded-lg bg-amber-300 text-stone-900 font-bold text-[11px]">2</div>
                                <div className="p-1 rounded-lg bg-amber-600 text-white font-bold text-[11px]">3</div>
                                <div className="p-1 rounded-lg bg-amber-600 text-white font-bold text-[11px]">4</div>
                                <div className="p-1 rounded-lg bg-amber-600 text-white font-bold text-[11px]">5</div>
                                <div className="p-1 rounded-lg bg-amber-600 text-white font-bold text-[11px]">6</div>

                                <div className="p-1 rounded-lg bg-amber-600 text-white font-bold text-[11px]">7</div>
                                <div className="p-1 rounded-lg bg-amber-600 text-white font-bold text-[11px]">8</div>
                                <div className="p-1 rounded-lg bg-amber-600 text-white font-bold text-[11px]">9</div>
                                <div className="p-1 rounded-lg bg-amber-600 text-white font-bold text-[11px]">10</div>
                                <div className="p-1 rounded-lg bg-amber-200 text-amber-800 font-bold text-[11px]">11</div>
                                <div className="p-1 rounded-lg bg-amber-600 text-white font-bold text-[11px]">12</div>
                                <div className="p-1 rounded-lg bg-amber-600 text-white font-bold text-[11px]">13</div>

                                <div className="p-1 rounded-lg bg-amber-600 text-white font-bold text-[11px]">14</div>
                                <div className="p-1 rounded-lg bg-amber-600 text-white font-bold text-[11px]">15</div>
                                <div className="p-1 rounded-lg bg-amber-600 text-white font-bold text-[11px]">16</div>
                                <div className="p-1 rounded-lg bg-amber-600 text-white font-bold text-[11px]">17</div>
                                <div className="p-1 rounded-lg bg-amber-600 text-white font-bold text-[11px]">18</div>
                                <div className="p-1 rounded-lg bg-amber-600 text-white font-bold text-[11px]">19</div>
                                <div className="p-1 rounded-lg bg-amber-600 text-white font-bold text-[11px]">20</div>

                                <div className="p-1 rounded-lg bg-amber-600 text-white font-bold text-[11px]">21</div>
                                <div className="p-1 rounded-lg bg-amber-600 text-white font-bold text-[11px]">22</div>
                                <div className="p-1 rounded-lg bg-amber-600 text-white font-bold text-[11px]">23</div>
                                <div className="p-1 rounded-lg bg-amber-600 text-white font-bold text-[11px]">24</div>
                                <div className="p-1 rounded-lg bg-stone-100 dark:bg-stone-850 text-stone-400 text-[11px]">25</div>
                                <div className="p-1 rounded-lg bg-stone-100 dark:bg-stone-850 text-stone-400 text-[11px]">26</div>
                                <div className="p-1 rounded-lg bg-stone-100 dark:bg-stone-850 text-stone-400 text-[11px]">27</div>
                            </div>

                            {/* Legend */}
                            <div className="pt-2 border-t border-stone-200/90 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                                <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span>7 hari tanpa jeda</span>
                                </div>
                                <div className="flex items-center gap-1 text-[10px]">
                                    <span>Rendah</span>
                                    <div className="flex items-center gap-0.5">
                                        <span className="w-2 h-2 rounded bg-amber-100" />
                                        <span className="w-2 h-2 rounded bg-amber-300" />
                                        <span className="w-2 h-2 rounded bg-amber-600" />
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
