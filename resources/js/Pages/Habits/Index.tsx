import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Archive,
    ArchiveRestore,
    Calendar as CalendarIcon,
    Check,
    ChevronLeft,
    ChevronRight,
    Edit3,
    Flame,
    Minus,
    MoreVertical,
    Plus,
    Search,
    Snowflake,
    Trash2,
    X,
} from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';

interface StreakInfo {
    current_streak: number;
    longest_streak: number;
    completion_rate: number;
    is_at_risk: boolean;
    streak_level: {
        level: number;
        label: string;
        badge: string;
    };
}

interface HabitLogInfo {
    id?: number;
    actual_value: number;
    status: 'completed' | 'partial' | 'not_completed' | 'freeze' | 'rest_day';
    notes?: string | null;
}

interface HabitItem {
    id: number;
    name: string;
    description: string | null;
    measurement_type: 'boolean' | 'quantitative' | 'duration';
    target_value: number;
    unit: string | null;
    frequency_type: 'daily' | 'specific_days' | 'weekly_target';
    scheduled_days: number[] | null;
    weekly_target_days: number | null;
    start_date: string;
    end_date: string | null;
    color: string | null;
    icon: string | null;
    is_archived: boolean;
    today_log: HabitLogInfo | null;
    streak: StreakInfo;
}

interface Props {
    habits: HabitItem[];
    archived_count: number;
    freeze_credits_remaining: number;
    filter_date: string;
    showing_archived: boolean;
}

const COLOR_OPTIONS = [
    { label: 'Amber', value: 'amber', bg: 'bg-amber-500', ring: 'ring-amber-500' },
    { label: 'Emerald', value: 'emerald', bg: 'bg-emerald-500', ring: 'ring-emerald-500' },
    { label: 'Rose', value: 'rose', bg: 'bg-rose-500', ring: 'ring-rose-500' },
    { label: 'Sky', value: 'sky', bg: 'bg-sky-500', ring: 'ring-sky-500' },
    { label: 'Indigo', value: 'indigo', bg: 'bg-indigo-500', ring: 'ring-indigo-500' },
    { label: 'Violet', value: 'violet', bg: 'bg-violet-500', ring: 'ring-violet-500' },
];

const DAYS_OF_WEEK = [
    { value: 1, label: 'Sen' },
    { value: 2, label: 'Sel' },
    { value: 3, label: 'Rab' },
    { value: 4, label: 'Kam' },
    { value: 5, label: 'Jum' },
    { value: 6, label: 'Sab' },
    { value: 7, label: 'Min' },
];

export default function HabitsIndex({
    habits,
    archived_count,
    freeze_credits_remaining,
    filter_date,
    showing_archived,
}: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'archived'>(
        showing_archived ? 'archived' : 'all'
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState<HabitItem | null>(null);
    const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        description: '',
        measurement_type: 'boolean' as 'boolean' | 'quantitative' | 'duration',
        target_value: 1,
        unit: '',
        frequency_type: 'daily' as 'daily' | 'specific_days' | 'weekly_target',
        scheduled_days: [1, 2, 3, 4, 5, 6, 7] as number[],
        weekly_target_days: 5,
        start_date: filter_date,
        color: 'amber',
        icon: 'check',
    });

    const openCreateModal = () => {
        setEditingHabit(null);
        clearErrors();
        reset();
        setData({
            name: '',
            description: '',
            measurement_type: 'boolean',
            target_value: 1,
            unit: '',
            frequency_type: 'daily',
            scheduled_days: [1, 2, 3, 4, 5, 6, 7],
            weekly_target_days: 5,
            start_date: filter_date,
            color: 'amber',
            icon: 'check',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (habit: HabitItem) => {
        setEditingHabit(habit);
        clearErrors();
        setData({
            name: habit.name,
            description: habit.description ?? '',
            measurement_type: habit.measurement_type,
            target_value: habit.target_value,
            unit: habit.unit ?? '',
            frequency_type: habit.frequency_type,
            scheduled_days: habit.scheduled_days ?? [1, 2, 3, 4, 5, 6, 7],
            weekly_target_days: habit.weekly_target_days ?? 5,
            start_date: habit.start_date,
            color: habit.color ?? 'amber',
            icon: habit.icon ?? 'check',
        });
        setActiveMenuId(null);
        setIsModalOpen(true);
    };

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (editingHabit) {
            put(route('habits.update', editingHabit.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route('habits.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDateChange = (newDate: string) => {
        router.get(
            route('habits.index'),
            { date: newDate, archived: showing_archived ? 1 : 0 },
            { preserveState: true }
        );
    };

    const shiftDate = (days: number) => {
        const d = new Date(filter_date);
        d.setDate(d.getDate() + days);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        handleDateChange(`${yyyy}-${mm}-${dd}`);
    };

    const toggleArchivedView = (showArchived: boolean) => {
        router.get(
            route('habits.index'),
            { date: filter_date, archived: showArchived ? 1 : 0 },
            { preserveState: true }
        );
    };

    // Logging actions
    const handleLogToggleBoolean = (habit: HabitItem) => {
        const isCompleted = habit.today_log?.status === 'completed';
        if (isCompleted) {
            router.delete(route('habits.logs.destroy', { habit: habit.id, date: filter_date }), {
                preserveScroll: true,
            });
        } else {
            router.post(
                route('habits.logs.store', habit.id),
                {
                    log_date: filter_date,
                    actual_value: 1,
                    status: 'completed',
                },
                { preserveScroll: true }
            );
        }
    };

    const handleStepValue = (habit: HabitItem, delta: number) => {
        const currentVal = habit.today_log ? Number(habit.today_log.actual_value) : 0;
        const targetVal = Number(habit.target_value);
        const nextVal = Math.max(0, Math.round((currentVal + delta) * 100) / 100);

        if (nextVal === 0) {
            router.delete(route('habits.logs.destroy', { habit: habit.id, date: filter_date }), {
                preserveScroll: true,
            });
            return;
        }

        const nextStatus = nextVal >= targetVal ? 'completed' : 'partial';

        router.post(
            route('habits.logs.store', habit.id),
            {
                log_date: filter_date,
                actual_value: nextVal,
                status: nextStatus,
            },
            { preserveScroll: true }
        );
    };

    const handleApplyFreeze = (habit: HabitItem) => {
        if (freeze_credits_remaining <= 0) {
            alert('Kuota freeze Anda untuk bulan ini sudah habis (Maks 2x/bulan).');
            return;
        }
        if (confirm(`Gunakan 1 kuota freeze untuk menjaga streak "${habit.name}" pada tanggal ini?`)) {
            router.post(
                route('habits.logs.store', habit.id),
                {
                    log_date: filter_date,
                    status: 'freeze',
                    actual_value: 0,
                },
                { preserveScroll: true }
            );
        }
    };

    const handleToggleArchive = (habit: HabitItem) => {
        setActiveMenuId(null);
        if (habit.is_archived) {
            router.post(route('habits.unarchive', habit.id), {}, { preserveScroll: true });
        } else {
            router.post(route('habits.archive', habit.id), {}, { preserveScroll: true });
        }
    };

    const handleDeleteHabit = (habit: HabitItem) => {
        setActiveMenuId(null);
        if (confirm(`Hapus kebiasaan "${habit.name}" beserta seluruh riwayat lognya secara permanen?`)) {
            router.delete(route('habits.destroy', habit.id), { preserveScroll: true });
        }
    };

    const filteredHabits = useMemo(() => {
        return habits.filter((h) => {
            if (selectedTab === 'active' && h.is_archived) return false;
            if (selectedTab === 'archived' && !h.is_archived) return false;
            if (searchQuery.trim() === '') return true;
            return (
                h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (h.description && h.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        });
    }, [habits, selectedTab, searchQuery]);

    const activeCount = habits.filter((h) => !h.is_archived).length;
    const completedCount = habits.filter((h) => !h.is_archived && h.today_log?.status === 'completed').length;

    const formattedDateLabel = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        if (filter_date === today) return 'Hari Ini';
        const d = new Date(filter_date);
        return d.toLocaleDateString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    }, [filter_date]);

    return (
        <AuthenticatedLayout>
            <Head title="Habit Tracker - MindStep" />

            <div className="space-y-6 max-w-7xl mx-auto pb-12">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200/90 dark:border-stone-800">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                                Manajemen Kebiasaan
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                                <Snowflake className="w-3 h-3 text-sky-500" />
                                Sisa Freeze: {freeze_credits_remaining}/2 bln ini
                            </span>
                        </div>
                        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
                            Habit Tracker
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                            Bangun dan pantau konsistensi rutinitas harianmu selangkah demi selangkah.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        {/* Date Navigator */}
                        <div className="flex items-center bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-xl p-1 shadow-sm text-xs font-semibold">
                            <button
                                onClick={() => shiftDate(-1)}
                                className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition"
                                title="Hari Sebelumnya"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <div className="flex items-center gap-1.5 px-2 text-stone-700 dark:text-stone-300">
                                <CalendarIcon className="w-3.5 h-3.5 text-amber-600" />
                                <span>{formattedDateLabel}</span>
                            </div>
                            <button
                                onClick={() => shiftDate(1)}
                                className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition"
                                title="Hari Berikutnya"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm shadow-amber-600/20 transition"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Tambah Habit</span>
                        </button>
                    </div>
                </div>

                {/* Quick Summary Pill & Filter Tabs */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                        <button
                            onClick={() => {
                                setSelectedTab('all');
                                if (showing_archived) toggleArchivedView(false);
                            }}
                            className={`px-3 py-1.5 rounded-full transition-all ${
                                selectedTab === 'all'
                                    ? 'bg-amber-600 text-white shadow-sm'
                                    : 'bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-850'
                            }`}
                        >
                            Semua ({habits.length})
                        </button>
                        <button
                            onClick={() => {
                                setSelectedTab('active');
                                if (showing_archived) toggleArchivedView(false);
                            }}
                            className={`px-3 py-1.5 rounded-full transition-all ${
                                selectedTab === 'active'
                                    ? 'bg-amber-600 text-white shadow-sm'
                                    : 'bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-850'
                            }`}
                        >
                            Sedang Aktif ({activeCount})
                        </button>
                        <button
                            onClick={() => {
                                setSelectedTab('archived');
                                toggleArchivedView(true);
                            }}
                            className={`px-3 py-1.5 rounded-full transition-all ${
                                selectedTab === 'archived'
                                    ? 'bg-amber-600 text-white shadow-sm'
                                    : 'bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-850'
                            }`}
                        >
                            Diarsipkan ({archived_count})
                        </button>

                        <span className="hidden sm:inline-block text-stone-300 dark:text-stone-700">|</span>

                        <span className="text-stone-500 dark:text-stone-400 text-xs">
                            Capaian: <strong className="text-amber-600">{completedCount}</strong>/{activeCount} tuntas
                        </span>
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari habit..."
                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-stone-900 rounded-xl border border-stone-200/90 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-amber-600"
                        />
                    </div>
                </div>

                {/* Habit Cards Grid */}
                {filteredHabits.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-stone-900/60 rounded-2xl border border-stone-200/80 dark:border-stone-800">
                        <AlertCircle className="w-10 h-10 mx-auto text-stone-400 dark:text-stone-500" />
                        <h3 className="mt-3 text-sm font-bold text-stone-800 dark:text-stone-200">
                            {searchQuery ? 'Tidak ada habit yang cocok' : 'Belum ada habit'}
                        </h3>
                        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                            {searchQuery
                                ? 'Coba ubah kata kunci pencarian Anda.'
                                : 'Mulai rutinitas baru sekarang untuk membangun kebiasaan baik setiap hari.'}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={openCreateModal}
                                className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Buat Habit Pertama</span>
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredHabits.map((habit) => {
                            const isCompleted = habit.today_log?.status === 'completed';
                            const isFreeze = habit.today_log?.status === 'freeze';
                            const actualVal = habit.today_log ? Number(habit.today_log.actual_value) : 0;
                            const targetVal = Number(habit.target_value);
                            const percent = Math.min(100, Math.round((actualVal / targetVal) * 100));

                            const colorStyle =
                                habit.color === 'emerald'
                                    ? 'bg-emerald-500'
                                    : habit.color === 'rose'
                                    ? 'bg-rose-500'
                                    : habit.color === 'sky'
                                    ? 'bg-sky-500'
                                    : habit.color === 'indigo'
                                    ? 'bg-indigo-500'
                                    : habit.color === 'violet'
                                    ? 'bg-violet-500'
                                    : 'bg-amber-500';

                            return (
                                <div
                                    key={habit.id}
                                    className={`relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-stone-900 border transition-all ${
                                        isCompleted
                                            ? 'border-emerald-200 dark:border-emerald-800/40 bg-emerald-500/[0.02]'
                                            : isFreeze
                                            ? 'border-sky-200 dark:border-sky-800/40 bg-sky-500/[0.02]'
                                            : 'border-stone-200/90 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 shadow-sm'
                                    }`}
                                >
                                    {/* Top Card Info */}
                                    <div>
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2.5 h-2.5 rounded-full ${colorStyle}`} />
                                                <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 capitalize">
                                                    {habit.frequency_type === 'daily'
                                                        ? 'Harian'
                                                        : habit.frequency_type === 'specific_days'
                                                        ? 'Hari Tertentu'
                                                        : `${habit.weekly_target_days} Hari/Pekan`}
                                                </span>
                                            </div>

                                            {/* Action Menu Dropdown */}
                                            <div className="relative">
                                                <button
                                                    onClick={() =>
                                                        setActiveMenuId(activeMenuId === habit.id ? null : habit.id)
                                                    }
                                                    className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>

                                                {activeMenuId === habit.id && (
                                                    <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-xl shadow-lg z-20 py-1 text-xs">
                                                        <button
                                                            onClick={() => openEditModal(habit)}
                                                            className="flex items-center gap-2 w-full px-3 py-2 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                                                        >
                                                            <Edit3 className="w-3.5 h-3.5 text-stone-400" />
                                                            <span>Edit Habit</span>
                                                        </button>
                                                        {!isFreeze && !isCompleted && !habit.is_archived && (
                                                            <button
                                                                onClick={() => {
                                                                    setActiveMenuId(null);
                                                                    handleApplyFreeze(habit);
                                                                }}
                                                                className="flex items-center gap-2 w-full px-3 py-2 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/30"
                                                            >
                                                                <Snowflake className="w-3.5 h-3.5" />
                                                                <span>Gunakan Freeze</span>
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleToggleArchive(habit)}
                                                            className="flex items-center gap-2 w-full px-3 py-2 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                                                        >
                                                            {habit.is_archived ? (
                                                                <>
                                                                    <ArchiveRestore className="w-3.5 h-3.5 text-stone-400" />
                                                                    <span>Pulihkan Habit</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Archive className="w-3.5 h-3.5 text-stone-400" />
                                                                    <span>Arsipkan</span>
                                                                </>
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteHabit(habit)}
                                                            className="flex items-center gap-2 w-full px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                            <span>Hapus Habit</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <h3 className="mt-2 text-base font-bold text-stone-900 dark:text-stone-100 line-clamp-1">
                                            {habit.name}
                                        </h3>
                                        {habit.description && (
                                            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                                                {habit.description}
                                            </p>
                                        )}

                                        {/* Streak Badge & Milestone */}
                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40 text-xs font-bold">
                                                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                                <span>{habit.streak.current_streak} Hari</span>
                                            </div>
                                            <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                                                {habit.streak.streak_level.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Bar per Measurement Type */}
                                    <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800/80">
                                        {habit.measurement_type === 'boolean' ? (
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                                                    {isCompleted ? (
                                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                                            ✓ Selesai
                                                        </span>
                                                    ) : isFreeze ? (
                                                        <span className="text-sky-600 dark:text-sky-400 font-bold">
                                                            ❄ Freeze Aktif
                                                        </span>
                                                    ) : (
                                                        'Belum Selesai'
                                                    )}
                                                </span>

                                                <button
                                                    onClick={() => handleLogToggleBoolean(habit)}
                                                    disabled={habit.is_archived}
                                                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                                                        isCompleted
                                                            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                                                            : 'bg-stone-100 dark:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700'
                                                    }`}
                                                >
                                                    <Check className="w-5 h-5 stroke-[2.5]" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                                                    <span className="text-stone-600 dark:text-stone-400">
                                                        {actualVal} / {targetVal} {habit.unit}
                                                    </span>
                                                    <span
                                                        className={
                                                            isCompleted
                                                                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                                                                : 'text-stone-500'
                                                        }
                                                    >
                                                        {percent}%
                                                    </span>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2 overflow-hidden mb-3">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${
                                                            isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                                                        }`}
                                                        style={{ width: `${percent}%` }}
                                                    />
                                                </div>

                                                {/* Stepper Buttons */}
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            onClick={() => handleStepValue(habit, -1)}
                                                            disabled={actualVal <= 0 || habit.is_archived}
                                                            className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-40 transition"
                                                        >
                                                            <Minus className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStepValue(habit, 1)}
                                                            disabled={habit.is_archived}
                                                            className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() =>
                                                            handleStepValue(
                                                                habit,
                                                                Math.max(1, Math.round(targetVal / 4))
                                                            )
                                                        }
                                                        disabled={habit.is_archived}
                                                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 transition"
                                                    >
                                                        +{Math.max(1, Math.round(targetVal / 4))} {habit.unit}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal Create & Edit Habit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
                            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                                {editingHabit ? 'Edit Kebiasaan' : 'Tambah Kebiasaan Baru'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
                            {/* Nama Habit */}
                            <div>
                                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                                    Nama Habit *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: Meditasi Pagi, Minum Air..."
                                    className="w-full text-xs bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 px-3 py-2 focus:outline-none focus:border-amber-600"
                                />
                                {errors.name && <p className="mt-1 text-[11px] text-rose-500">{errors.name}</p>}
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                                    Deskripsi / Catatan Singkat
                                </label>
                                <textarea
                                    rows={2}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Alasan atau motivasi kebiasaan ini..."
                                    className="w-full text-xs bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 px-3 py-2 focus:outline-none focus:border-amber-600"
                                />
                            </div>

                            {/* Tipe Pengukuran */}
                            <div>
                                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                                    Tipe Pengukuran
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'boolean', label: 'Ya / Tidak' },
                                        { id: 'quantitative', label: 'Kuantitas' },
                                        { id: 'duration', label: 'Durasi' },
                                    ].map((t) => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => setData('measurement_type', t.id as any)}
                                            className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                                                data.measurement_type === t.id
                                                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                                                    : 'bg-stone-50 dark:bg-stone-850 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:bg-stone-100'
                                            }`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Target Nilai & Satuan */}
                            {data.measurement_type !== 'boolean' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                                            Target Angka *
                                        </label>
                                        <input
                                            type="number"
                                            step="any"
                                            required
                                            value={data.target_value}
                                            onChange={(e) => setData('target_value', Number(e.target.value))}
                                            className="w-full text-xs bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 px-3 py-2 focus:outline-none focus:border-amber-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                                            Satuan Unit *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.unit}
                                            onChange={(e) => setData('unit', e.target.value)}
                                            placeholder="ml, halaman, menit..."
                                            className="w-full text-xs bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 px-3 py-2 focus:outline-none focus:border-amber-600"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Frekuensi */}
                            <div>
                                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                                    Jadwal Frekuensi
                                </label>
                                <select
                                    value={data.frequency_type}
                                    onChange={(e) => setData('frequency_type', e.target.value as any)}
                                    className="w-full text-xs bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 px-3 py-2 focus:outline-none focus:border-amber-600"
                                >
                                    <option value="daily">Setiap Hari</option>
                                    <option value="specific_days">Hari Tertentu dalam Sepekan</option>
                                    <option value="weekly_target">Target Jumlah Hari per Pekan</option>
                                </select>
                            </div>

                            {/* Specific Days Checkbox */}
                            {data.frequency_type === 'specific_days' && (
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                                        Pilih Hari Aktif
                                    </label>
                                    <div className="flex items-center gap-1.5">
                                        {DAYS_OF_WEEK.map((d) => {
                                            const isSelected = data.scheduled_days.includes(d.value);
                                            return (
                                                <button
                                                    key={d.value}
                                                    type="button"
                                                    onClick={() => {
                                                        const current = [...data.scheduled_days];
                                                        const next = isSelected
                                                            ? current.filter((v) => v !== d.value)
                                                            : [...current, d.value];
                                                        setData('scheduled_days', next);
                                                    }}
                                                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                        isSelected
                                                            ? 'bg-amber-600 text-white'
                                                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                                                    }`}
                                                >
                                                    {d.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Weekly target count */}
                            {data.frequency_type === 'weekly_target' && (
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                                        Jumlah Hari per Pekan (1-7)
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={7}
                                        value={data.weekly_target_days}
                                        onChange={(e) => setData('weekly_target_days', Number(e.target.value))}
                                        className="w-full text-xs bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 px-3 py-2 focus:outline-none focus:border-amber-600"
                                    />
                                </div>
                            )}

                            {/* Pilihan Warna */}
                            <div>
                                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                                    Warna Label
                                </label>
                                <div className="flex items-center gap-3">
                                    {COLOR_OPTIONS.map((c) => (
                                        <button
                                            key={c.value}
                                            type="button"
                                            onClick={() => setData('color', c.value)}
                                            className={`w-7 h-7 rounded-full ${c.bg} flex items-center justify-center transition-all ${
                                                data.color === c.value ? 'ring-2 ring-offset-2 ' + c.ring : 'opacity-70'
                                            }`}
                                        >
                                            {data.color === c.value && <Check className="w-4 h-4 text-white stroke-[3]" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-xl transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm shadow-amber-600/30 transition disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : editingHabit ? 'Simpan Perubahan' : 'Buat Habit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
