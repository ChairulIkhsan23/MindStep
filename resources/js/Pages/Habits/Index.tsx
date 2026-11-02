import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import IconPickerModal from '@/Components/IconPickerModal';
import Icons from '@/Components/Icons';
import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Archive,
    ArchiveRestore,
    ArrowDown,
    ArrowUp,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    Edit3,
    Hash,
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

interface WeekDayInfo {
    date: string;
    day_name: string;
    day_number: number;
    is_today: boolean;
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
    time_of_day: string | null;
    is_archived: boolean;
    today_log: HabitLogInfo | null;
    week_logs?: Record<string, HabitLogInfo>;
    streak?: StreakInfo;
    stats?: StreakInfo;
}

interface Props {
    habits: HabitItem[];
    archived_count: number;
    freeze_credits_remaining: number;
    filter_date: string;
    week_days?: WeekDayInfo[];
    week_start?: string;
    week_end?: string;
    showing_archived: boolean;
}

const COLOR_OPTIONS = [
    { label: 'Amber', value: '#d97706', bg: 'bg-amber-500', ring: 'ring-amber-500' },
    { label: 'Emerald', value: '#10b981', bg: 'bg-emerald-500', ring: 'ring-emerald-500' },
    { label: 'Rose', value: '#f43f5e', bg: 'bg-rose-500', ring: 'ring-rose-500' },
    { label: 'Sky', value: '#0284c7', bg: 'bg-sky-500', ring: 'ring-sky-500' },
    { label: 'Indigo', value: '#6366f1', bg: 'bg-indigo-500', ring: 'ring-indigo-500' },
    { label: 'Violet', value: '#8b5cf6', bg: 'bg-violet-500', ring: 'ring-violet-500' },
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
    week_days = [],
    week_start,
    week_end,
    showing_archived,
}: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [timeSortOrder, setTimeSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
    const [guardModalInfo, setGuardModalInfo] = useState<{
        show: boolean;
        targetDate: string;
    }>({ show: false, targetDate: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState<HabitItem | null>(null);
    const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

    // Inline Editing states
    const [inlineNameId, setInlineNameId] = useState<number | null>(null);
    const [inlineNameValue, setInlineNameValue] = useState<string>('');
    const [activeStylePopoverId, setActiveStylePopoverId] = useState<number | null>(null);
    const [activeTypePopoverId, setActiveTypePopoverId] = useState<number | null>(null);
    const [iconPickerTarget, setIconPickerTarget] = useState<'form' | HabitItem | null>(null);

    // Quick popover cell editor for quantitative / duration
    const [activeCellEdit, setActiveCellEdit] = useState<{
        habit: HabitItem;
        date: string;
        currentVal: number;
    } | null>(null);

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
        color: '#d97706',
        icon: 'check',
        time_of_day: '' as string,
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
            color: '#d97706',
            icon: 'check',
            time_of_day: '',
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
            color: habit.color ?? '#d97706',
            icon: habit.icon ?? 'check',
            time_of_day: habit.time_of_day ?? '',
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

    // Inline updates
    const saveInlineName = (habit: HabitItem) => {
        const trimmed = inlineNameValue.trim();
        if (trimmed && trimmed !== habit.name) {
            router.put(
                route('habits.update', habit.id),
                { name: trimmed },
                { preserveScroll: true, preserveState: true }
            );
        }
        setInlineNameId(null);
    };

    const saveInlineStyle = (habit: HabitItem, newColor?: string, newIcon?: string) => {
        router.put(
            route('habits.update', habit.id),
            {
                color: newColor ?? habit.color ?? '#d97706',
                icon: newIcon ?? habit.icon ?? 'check',
            },
            { preserveScroll: true, preserveState: true }
        );
        setActiveStylePopoverId(null);
    };

    const saveInlineTarget = (
        habit: HabitItem,
        type: 'boolean' | 'quantitative' | 'duration',
        targetVal: number,
        unitVal: string
    ) => {
        router.put(
            route('habits.update', habit.id),
            {
                measurement_type: type,
                target_value: targetVal,
                unit: type === 'boolean' ? '' : unitVal,
            },
            { preserveScroll: true, preserveState: true }
        );
        setActiveTypePopoverId(null);
    };

    const handleShiftWeek = (days: number) => {
        const d = new Date(filter_date);
        d.setDate(d.getDate() + days);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        router.get(
            route('habits.index'),
            { date: `${yyyy}-${mm}-${dd}`, archived: showing_archived ? 1 : 0 },
            { preserveState: true }
        );
    };

    const toggleArchivedView = (showArchived: boolean) => {
        router.get(
            route('habits.index'),
            { date: filter_date, archived: showArchived ? 1 : 0 },
            { preserveState: true }
        );
    };

    // Cell logging actions with Today guard
    const handleCellClick = (habit: HabitItem, dateStr: string) => {
        const todayDate = filter_date;
        if (dateStr !== todayDate) {
            setGuardModalInfo({
                show: true,
                targetDate: dateStr,
            });
            return;
        }

        const log = habit.week_logs?.[dateStr];
        const isCompleted = log?.status === 'completed';

        if (habit.measurement_type === 'boolean') {
            if (isCompleted) {
                router.delete(route('habits.logs.destroy', { habit: habit.id, date: dateStr }), {
                    preserveScroll: true,
                });
            } else {
                router.post(
                    route('habits.logs.store', habit.id),
                    {
                        log_date: dateStr,
                        actual_value: 1,
                        status: 'completed',
                    },
                    { preserveScroll: true }
                );
            }
        } else {
            setActiveCellEdit({
                habit,
                date: dateStr,
                currentVal: log ? Number(log.actual_value) : 0,
            });
        }
    };

    const saveCellLog = (val: number) => {
        if (!activeCellEdit) return;
        const { habit, date } = activeCellEdit;
        const targetVal = Number(habit.target_value);

        if (val <= 0) {
            router.delete(route('habits.logs.destroy', { habit: habit.id, date }), {
                preserveScroll: true,
            });
        } else {
            router.post(
                route('habits.logs.store', habit.id),
                {
                    log_date: date,
                    actual_value: val,
                    status: val >= targetVal ? 'completed' : 'partial',
                },
                { preserveScroll: true }
            );
        }
        setActiveCellEdit(null);
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
        let result = habits.filter((h) => {
            if (searchQuery.trim() === '') return true;
            return (
                h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (h.description && h.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        });

        if (timeSortOrder === 'asc') {
            result = [...result].sort((a, b) => {
                const tA = a.time_of_day || '99:99';
                const tB = b.time_of_day || '99:99';
                return tA.localeCompare(tB);
            });
        } else if (timeSortOrder === 'desc') {
            result = [...result].sort((a, b) => {
                const tA = a.time_of_day || '00:00';
                const tB = b.time_of_day || '00:00';
                return tB.localeCompare(tA);
            });
        }

        return result;
    }, [habits, searchQuery, timeSortOrder]);

    const formattedRange = useMemo(() => {
        if (!week_start || !week_end) return '';
        const d1 = new Date(week_start);
        const d2 = new Date(week_end);
        const opt: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
        return `${d1.toLocaleDateString('id-ID', opt)} - ${d2.toLocaleDateString('id-ID', { ...opt, year: 'numeric' })}`;
    }, [week_start, week_end]);

    const renderHabitIcon = (iconName: string | null, className = 'w-3.5 h-3.5 text-white') => {
        return <Icons name={iconName} className={className} />;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Habit Tracker - MindStep" />

            <div className="space-y-6 max-w-7xl mx-auto pb-12">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                            Habit Tracker
                        </h1>
                        <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                            Pantau konsistensi dan progres kebiasaan pekan ini.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Week Navigator */}
                        <div className="flex items-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-0.5 text-xs font-medium">
                            <button
                                onClick={() => handleShiftWeek(-7)}
                                className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition"
                                title="Pekan Sebelumnya"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="px-2 text-stone-700 dark:text-stone-300 font-semibold whitespace-nowrap">
                                {formattedRange}
                            </span>
                            <button
                                onClick={() => handleShiftWeek(7)}
                                className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition"
                                title="Pekan Berikutnya"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 transition whitespace-nowrap"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Tambah Habit</span>
                        </button>
                    </div>
                </div>

                {/* Toolbar: Sorting Waktu & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Waktu Sorting Buttons */}
                    <div className="flex items-center gap-1 text-xs font-medium">
                        <span className="text-stone-500 dark:text-stone-400 mr-1 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Urutkan:</span>
                        </span>
                        <button
                            type="button"
                            onClick={() => setTimeSortOrder(timeSortOrder === 'asc' ? 'none' : 'asc')}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-medium transition ${
                                timeSortOrder === 'asc'
                                    ? 'bg-amber-600 text-white border-amber-600'
                                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-850'
                            }`}
                        >
                            <ArrowUp className="w-3 h-3" />
                            <span>Pagi ke Malam</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setTimeSortOrder(timeSortOrder === 'desc' ? 'none' : 'desc')}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-medium transition ${
                                timeSortOrder === 'desc'
                                    ? 'bg-amber-600 text-white border-amber-600'
                                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-850'
                            }`}
                        >
                            <ArrowDown className="w-3 h-3" />
                            <span>Malam ke Pagi</span>
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-60">
                        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari habit..."
                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-amber-600"
                        />
                    </div>
                </div>

                {/* WEEKLY MATRIX SPREADSHEET TABLE */}
                {/* Global Click-Outside Backdrop for Inline Popovers */}
                {(activeStylePopoverId !== null || activeTypePopoverId !== null || activeMenuId !== null) && (
                    <div
                        className="fixed inset-0 z-30 bg-transparent"
                        onClick={() => {
                            setActiveStylePopoverId(null);
                            setActiveTypePopoverId(null);
                            setActiveMenuId(null);
                        }}
                    />
                )}

                {filteredHabits.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                        <AlertCircle className="w-8 h-8 mx-auto text-stone-400 dark:text-stone-500" />
                        <h3 className="mt-2 text-sm font-semibold text-stone-800 dark:text-stone-200">
                            {searchQuery ? 'Tidak ada habit yang cocok' : 'Belum ada habit'}
                        </h3>
                        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                            Mulai rutinitas baru untuk mencatat konsistensi pekan ini.
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={openCreateModal}
                                className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 transition"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Buat Habit Pertama</span>
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
                        <div className="overflow-x-auto min-h-[380px] pb-28">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-850/60 text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                                        <th className="py-3 pl-5 pr-4 min-w-[240px]">Nama Kebiasaan</th>
                                        <th className="py-3 px-3 w-32 text-center">Tipe / Target</th>
                                        {/* 7 Days Column */}
                                        {week_days.map((wd) => (
                                            <th
                                                key={wd.date}
                                                className={`py-3 px-2 text-center min-w-[58px] ${
                                                    wd.is_today
                                                        ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold'
                                                        : ''
                                                }`}
                                            >
                                                <div>{wd.day_name}</div>
                                                <div className="text-stone-800 dark:text-stone-200 text-xs font-semibold mt-0.5">
                                                    {wd.day_number}
                                                </div>
                                            </th>
                                        ))}
                                        <th className="py-3 px-3 w-28 text-center">Progress Pekan</th>
                                        <th className="py-3 pr-4 pl-2 w-12 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100 dark:divide-stone-800/70 text-xs">
                                    {filteredHabits.map((habit) => {
                                        // Count week completions
                                        let weekCompleted = 0;
                                        week_days.forEach((wd) => {
                                            const log = habit.week_logs?.[wd.date];
                                            if (log?.status === 'completed') weekCompleted++;
                                        });
                                        const weekPercent = Math.min(100, Math.round((weekCompleted / 7) * 100));

                                        const isRowActive =
                                            activeStylePopoverId === habit.id ||
                                            activeTypePopoverId === habit.id ||
                                            activeMenuId === habit.id;

                                        return (
                                            <tr
                                                key={habit.id}
                                                className={`transition-colors ${
                                                    isRowActive
                                                        ? 'relative z-40 bg-stone-50 dark:bg-stone-850'
                                                        : 'hover:bg-stone-50/60 dark:hover:bg-stone-850/40'
                                                }`}
                                            >
                                                {/* Kolom Info Habit (Inline Edit Icon, Warna & Nama) */}
                                                <td className={`py-3 pl-5 pr-4 ${activeStylePopoverId === habit.id ? 'relative z-50' : ''}`}>
                                                    <div className="flex items-center gap-2.5 relative">
                                                        {/* Icon & Color Trigger Button */}
                                                        <div className="relative">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setActiveStylePopoverId(
                                                                        activeStylePopoverId === habit.id ? null : habit.id
                                                                    );
                                                                    setActiveTypePopoverId(null);
                                                                    setActiveMenuId(null);
                                                                }}
                                                                title="Ubah icon & warna habit"
                                                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-opacity hover:opacity-90"
                                                                style={{ backgroundColor: habit.color || '#d97706' }}
                                                            >
                                                                {renderHabitIcon(habit.icon)}
                                                            </button>

                                                            {/* Popover Icon & Color Picker */}
                                                            {activeStylePopoverId === habit.id && (
                                                                <div
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="absolute left-0 top-full mt-1.5 w-64 p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-lg z-50 space-y-3"
                                                                >
                                                                    <div>
                                                                        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-1.5">
                                                                            Pilih Warna
                                                                        </label>
                                                                        <div className="flex items-center gap-1.5">
                                                                            {COLOR_OPTIONS.map((c) => (
                                                                                <button
                                                                                    key={c.value}
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        saveInlineStyle(habit, c.value, undefined)
                                                                                    }
                                                                                    className={`w-6 h-6 rounded-full ${c.bg} flex items-center justify-center transition-all ${
                                                                                        habit.color === c.value ? 'ring-2 ring-offset-2 ' + c.ring : 'opacity-80'
                                                                                    }`}
                                                                                >
                                                                                    {habit.color === c.value && (
                                                                                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                                                                                    )}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-1.5">
                                                                            Pilih Icon
                                                                        </label>
                                                                        {/* Quick Popular Icons */}
                                                                        <div className="grid grid-cols-4 gap-1.5 max-h-32 overflow-y-auto pr-1">
                                                                            {[
                                                                                'check',
                                                                                'droplets',
                                                                                'book-open',
                                                                                'dumbbell',
                                                                                'brain',
                                                                                'sun',
                                                                                'moon',
                                                                                'heart',
                                                                                'coffee',
                                                                                'zap',
                                                                                'activity',
                                                                            ].map((iconKey) => {
                                                                                const isSelected = habit.icon === iconKey;
                                                                                return (
                                                                                    <button
                                                                                        key={iconKey}
                                                                                        type="button"
                                                                                        onClick={() =>
                                                                                            saveInlineStyle(habit, undefined, iconKey)
                                                                                        }
                                                                                        className={`p-2 rounded-lg flex items-center justify-center border transition-all ${
                                                                                            isSelected
                                                                                                ? 'bg-amber-600 text-white border-amber-600'
                                                                                                : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100'
                                                                                        }`}
                                                                                    >
                                                                                        <Icons name={iconKey} className="w-4 h-4" />
                                                                                    </button>
                                                                                );
                                                                            })}
                                                                        </div>

                                                                        {/* Button to open full dynamic IconPickerModal */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setIconPickerTarget(habit);
                                                                                setActiveStylePopoverId(null);
                                                                            }}
                                                                            className="mt-2.5 w-full py-1.5 px-2.5 rounded-lg text-[11px] font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 border border-stone-200 dark:border-stone-700 transition flex items-center justify-center gap-1.5"
                                                                        >
                                                                            <Search className="w-3.5 h-3.5" />
                                                                            <span>Cari Icon Lainnya...</span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Nama Habit: Klik untuk inline rename */}
                                                        <div className="min-w-0 flex-1">
                                                            {inlineNameId === habit.id ? (
                                                                <input
                                                                    type="text"
                                                                    autoFocus
                                                                    value={inlineNameValue}
                                                                    onChange={(e) => setInlineNameValue(e.target.value)}
                                                                    onBlur={() => saveInlineName(habit)}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') saveInlineName(habit);
                                                                        if (e.key === 'Escape') setInlineNameId(null);
                                                                    }}
                                                                    className="w-full text-xs font-semibold text-stone-900 dark:text-stone-100 bg-stone-50 dark:bg-stone-850 px-2 py-1 rounded-md border border-amber-600 focus:outline-none"
                                                                />
                                                            ) : (
                                                                <div
                                                                    onClick={() => {
                                                                        setInlineNameId(habit.id);
                                                                        setInlineNameValue(habit.name);
                                                                    }}
                                                                    title="Klik untuk ubah nama"
                                                                    className="font-medium text-stone-900 dark:text-stone-100 flex items-center gap-1.5 cursor-pointer group"
                                                                >
                                                                    <span className="group-hover:text-amber-600 transition-colors">
                                                                        {habit.name}
                                                                    </span>
                                                                    {habit.time_of_day && (
                                                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
                                                                            <Clock className="w-2.5 h-2.5" />
                                                                            {habit.time_of_day}
                                                                        </span>
                                                                    )}
                                                                    <Edit3 className="w-3 h-3 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                    {habit.is_archived && (
                                                                        <span className="text-[10px] font-medium text-stone-400 px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800">
                                                                            Arsip
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                            {habit.description && (
                                                                <div className="text-[11px] text-stone-400 dark:text-stone-500 line-clamp-1">
                                                                    {habit.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Kolom Tipe / Target (Inline Popover Editor) */}
                                                <td className={`py-3 px-3 text-center ${activeTypePopoverId === habit.id ? 'relative z-50' : 'relative'}`}>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                             e.stopPropagation();
                                                            setActiveTypePopoverId(
                                                                activeTypePopoverId === habit.id ? null : habit.id
                                                            );
                                                            setActiveStylePopoverId(null);
                                                            setActiveMenuId(null);
                                                        }}
                                                        title="Klik untuk ubah tipe atau target"
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-medium bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-750 transition"
                                                    >
                                                        {habit.measurement_type === 'boolean' && (
                                                            <>
                                                                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                                                <span>Ya/Tidak</span>
                                                            </>
                                                        )}
                                                        {habit.measurement_type === 'quantitative' && (
                                                            <>
                                                                <Hash className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                                                <span>
                                                                    {habit.target_value} {habit.unit}
                                                                </span>
                                                            </>
                                                        )}
                                                        {habit.measurement_type === 'duration' && (
                                                            <>
                                                                <Clock className="w-3 h-3 text-stone-600 dark:text-stone-400" />
                                                                <span>
                                                                    {habit.target_value} {habit.unit}
                                                                </span>
                                                            </>
                                                        )}
                                                    </button>

                                                    {/* Popover Inline Target Editor */}
                                                    {activeTypePopoverId === habit.id && (
                                                        <div
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-56 p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-lg z-50 text-left space-y-2.5"
                                                        >
                                                            <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                                                                Ganti Tipe Target
                                                            </div>
                                                            <div className="flex flex-col gap-1.5">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        saveInlineTarget(habit, 'boolean', 1, '')
                                                                    }
                                                                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium text-left flex items-center gap-2 ${
                                                                        habit.measurement_type === 'boolean'
                                                                            ? 'bg-amber-600 text-white'
                                                                            : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                                                                    }`}
                                                                >
                                                                    <Check className="w-3.5 h-3.5" />
                                                                    <span>Ya / Tidak</span>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        saveInlineTarget(
                                                                            habit,
                                                                            'quantitative',
                                                                            habit.target_value || 2000,
                                                                            habit.unit || 'ml'
                                                                        )
                                                                    }
                                                                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium text-left flex items-center gap-2 ${
                                                                        habit.measurement_type === 'quantitative'
                                                                            ? 'bg-amber-600 text-white'
                                                                            : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                                                                    }`}
                                                                >
                                                                    <Hash className="w-3.5 h-3.5" />
                                                                    <span>Kuantitas Terukur</span>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        saveInlineTarget(
                                                                            habit,
                                                                            'duration',
                                                                            habit.target_value || 30,
                                                                            habit.unit || 'menit'
                                                                        )
                                                                    }
                                                                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium text-left flex items-center gap-2 ${
                                                                        habit.measurement_type === 'duration'
                                                                            ? 'bg-amber-600 text-white'
                                                                            : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                                                                    }`}
                                                                >
                                                                    <Clock className="w-3.5 h-3.5" />
                                                                    <span>Durasi Waktu</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* 7 Days Cells: Circle Polos Tanpa Shadow */}
                                                {week_days.map((wd) => {
                                                    const log = habit.week_logs?.[wd.date];
                                                    const isCompleted = log?.status === 'completed';
                                                    const isPartial = log?.status === 'partial';
                                                    const isFreeze = log?.status === 'freeze';

                                                    return (
                                                        <td
                                                            key={wd.date}
                                                            className={`py-3 px-1 text-center align-middle ${
                                                                wd.is_today ? 'bg-amber-500/[0.04]' : ''
                                                            }`}
                                                        >
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCellClick(habit, wd.date)}
                                                                disabled={habit.is_archived}
                                                                title={`Tandai log ${wd.date}`}
                                                                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-semibold text-xs border transition-colors ${
                                                                    isCompleted
                                                                        ? 'bg-emerald-600 border-emerald-600 text-white'
                                                                        : isFreeze
                                                                        ? 'bg-sky-600 border-sky-600 text-white'
                                                                        : isPartial
                                                                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-800 dark:text-amber-300'
                                                                        : 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-stone-300 dark:text-stone-600 hover:border-amber-600 hover:text-amber-600'
                                                                }`}
                                                            >
                                                                {isFreeze ? (
                                                                    <Snowflake className="w-3.5 h-3.5 stroke-[2]" />
                                                                ) : isCompleted ? (
                                                                    <Check className="w-4 h-4 stroke-[2.5]" />
                                                                ) : isPartial ? (
                                                                    <span className="text-[10px] font-bold leading-none">½</span>
                                                                ) : (
                                                                    <Check className="w-3.5 h-3.5 stroke-[2] opacity-0 hover:opacity-40 transition-opacity" />
                                                                )}
                                                            </button>
                                                        </td>
                                                    );
                                                })}

                                                {/* Progress Pekan */}
                                                <td className="py-3 px-3 text-center">
                                                    <div className="w-20 mx-auto">
                                                        <div className="flex items-center justify-between text-[10px] font-medium text-stone-500 mb-1">
                                                            <span>{weekCompleted}/7</span>
                                                            <span>{weekPercent}%</span>
                                                        </div>
                                                        <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
                                                            <div
                                                                className="h-full bg-emerald-600 rounded-full transition-all"
                                                                style={{ width: `${weekPercent}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Aksi Menu */}
                                                <td className={`py-3 pr-4 pl-2 text-center ${activeMenuId === habit.id ? 'relative z-50' : 'relative'}`}>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveMenuId(activeMenuId === habit.id ? null : habit.id);
                                                            setActiveStylePopoverId(null);
                                                            setActiveTypePopoverId(null);
                                                        }}
                                                        className="p-1 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>

                                                    {activeMenuId === habit.id && (
                                                        <div
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="absolute right-4 top-full mt-1 w-44 bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-lg shadow-lg z-50 py-1 text-xs text-left"
                                                        >
                                                            <button
                                                                onClick={() => openEditModal(habit)}
                                                                className="flex items-center gap-2 w-full px-3 py-2 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                                                            >
                                                                <Edit3 className="w-3.5 h-3.5 text-stone-400" />
                                                                <span>Edit Detail</span>
                                                            </button>
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
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Cell Value Editor Modal for Quantitative & Duration */}
            {activeCellEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
                    <div className="bg-white dark:bg-stone-900 rounded-xl max-w-sm w-full p-4 border border-stone-200 dark:border-stone-800 shadow-lg">
                        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                            <div>
                                <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
                                    Catat Capaian
                                </h3>
                                <p className="text-[11px] text-stone-500">
                                    {activeCellEdit.habit.name} ({activeCellEdit.date})
                                </p>
                            </div>
                            <button
                                onClick={() => setActiveCellEdit(null)}
                                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-md"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="py-3 space-y-3">
                            <div className="flex items-center justify-between text-xs font-medium text-stone-600 dark:text-stone-400">
                                <span>Target: {activeCellEdit.habit.target_value} {activeCellEdit.habit.unit}</span>
                                <span>Nilai Sekarang: {activeCellEdit.currentVal}</span>
                            </div>

                            {/* Stepper Input */}
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveCellEdit({
                                            ...activeCellEdit,
                                            currentVal: Math.max(0, activeCellEdit.currentVal - 1),
                                        })
                                    }
                                    className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold hover:bg-stone-200 dark:hover:bg-stone-750 transition"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <input
                                    type="number"
                                    step="any"
                                    value={activeCellEdit.currentVal}
                                    onChange={(e) =>
                                        setActiveCellEdit({
                                            ...activeCellEdit,
                                            currentVal: Number(e.target.value),
                                        })
                                    }
                                    className="flex-1 text-center font-semibold text-base py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveCellEdit({
                                            ...activeCellEdit,
                                            currentVal: activeCellEdit.currentVal + 1,
                                        })
                                    }
                                    className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold hover:bg-stone-200 dark:hover:bg-stone-750 transition"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Quick Add Presets */}
                            <div className="flex items-center gap-1.5 pt-1">
                                {[
                                    { label: 'Reset', val: 0 },
                                    { label: '+25%', val: Math.round(Number(activeCellEdit.habit.target_value) * 0.25) },
                                    { label: '+50%', val: Math.round(Number(activeCellEdit.habit.target_value) * 0.5) },
                                    { label: 'Tuntas', val: Number(activeCellEdit.habit.target_value) },
                                ].map((preset, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => {
                                            const next = preset.val === 0 ? 0 : activeCellEdit.currentVal + preset.val;
                                            setActiveCellEdit({
                                                ...activeCellEdit,
                                                currentVal: preset.label === 'Tuntas' ? preset.val : next,
                                            });
                                        }}
                                        className="flex-1 py-1 text-[10px] font-medium rounded-md bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 transition"
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
                            <button
                                type="button"
                                onClick={() => setActiveCellEdit(null)}
                                className="px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={() => saveCellLog(activeCellEdit.currentVal)}
                                className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-md transition"
                            >
                                Simpan Capaian
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Create & Edit Habit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
                    <div className="bg-white dark:bg-stone-900 rounded-xl max-w-lg w-full p-5 border border-stone-200 dark:border-stone-800 shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                                {editingHabit ? 'Edit Kebiasaan' : 'Tambah Kebiasaan Baru'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                            >
                                <X className="w-4 h-4" />
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
                                    placeholder="Contoh: Meditasi Pagi, Minum Air, Olahraga..."
                                    className="w-full text-xs bg-white dark:bg-stone-850 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 px-3 py-2 focus:outline-none focus:border-amber-600"
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
                                    className="w-full text-xs bg-white dark:bg-stone-850 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 px-3 py-2 focus:outline-none focus:border-amber-600"
                                />
                            </div>

                            {/* Tipe Pengukuran */}
                            <div>
                                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                                    Tipe Pengukuran Kebiasaan
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'boolean', label: 'Ya / Tidak', icon: Check },
                                        { id: 'quantitative', label: 'Kuantitas', icon: Hash },
                                        { id: 'duration', label: 'Durasi Waktu', icon: Clock },
                                    ].map((t) => {
                                        const IconComp = t.icon;
                                        return (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => {
                                                    setData('measurement_type', t.id as any);
                                                    if (t.id === 'boolean') {
                                                        setData('unit', '');
                                                        setData('target_value', 1);
                                                    } else if (t.id === 'duration' && !data.unit) {
                                                        setData('unit', 'menit');
                                                    }
                                                }}
                                                className={`flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg border transition-all ${
                                                    data.measurement_type === t.id
                                                        ? 'bg-amber-600 text-white border-amber-600'
                                                        : 'bg-stone-50 dark:bg-stone-850 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:bg-stone-100'
                                                }`}
                                            >
                                                <IconComp className="w-3.5 h-3.5" />
                                                <span>{t.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Target Nilai & Satuan */}
                            {data.measurement_type !== 'boolean' && (
                                <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 dark:bg-stone-850 rounded-lg border border-stone-200 dark:border-stone-800">
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
                                            placeholder="Contoh: 2000, 30"
                                            className="w-full text-xs bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 px-3 py-2 focus:outline-none focus:border-amber-600"
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
                                            placeholder={data.measurement_type === 'duration' ? 'menit, jam' : 'ml, halaman, langkah'}
                                            className="w-full text-xs bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 px-3 py-2 focus:outline-none focus:border-amber-600"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Frekuensi & Waktu */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                                        Jadwal Frekuensi
                                    </label>
                                    <select
                                        value={data.frequency_type}
                                        onChange={(e) => setData('frequency_type', e.target.value as any)}
                                        className="w-full text-xs bg-white dark:bg-stone-850 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 px-3 py-2 focus:outline-none focus:border-amber-600"
                                    >
                                        <option value="daily">Setiap Hari (Harian)</option>
                                        <option value="specific_days">Hari Tertentu dalam Pekan</option>
                                        <option value="weekly_target">Target Hari per Pekan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                                        Waktu Pelaksanaan (Opsional)
                                    </label>
                                    <input
                                        type="time"
                                        value={data.time_of_day}
                                        onChange={(e) => setData('time_of_day', e.target.value)}
                                        className="w-full text-xs bg-white dark:bg-stone-850 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 px-3 py-2 focus:outline-none focus:border-amber-600"
                                    />
                                    {errors.time_of_day && (
                                        <p className="mt-1 text-[11px] text-rose-500">{errors.time_of_day}</p>
                                    )}
                                </div>
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
                                                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                                        isSelected
                                                            ? 'bg-amber-600 text-white'
                                                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
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
                                        className="w-full text-xs bg-white dark:bg-stone-850 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 px-3 py-2 focus:outline-none focus:border-amber-600"
                                    />
                                </div>
                            )}

                            {/* Pilihan Warna */}
                            <div>
                                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                                    Warna Label Kebiasaan
                                </label>
                                <div className="flex items-center gap-2.5">
                                    {COLOR_OPTIONS.map((c) => (
                                        <button
                                            key={c.value}
                                            type="button"
                                            onClick={() => setData('color', c.value)}
                                            className={`w-6 h-6 rounded-full ${c.bg} flex items-center justify-center transition-all ${
                                                data.color === c.value ? 'ring-2 ring-offset-2 ' + c.ring : 'opacity-70'
                                            }`}
                                        >
                                            {data.color === c.value && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Pilihan Icon Kebiasaan di Modal Create */}
                            <div>
                                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                                    Icon Kebiasaan
                                </label>
                                <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-lg border border-stone-200 dark:border-stone-800 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div
                                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                style={{ backgroundColor: data.color || '#d97706' }}
                                            >
                                                <Icons name={data.icon} className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                                                    {data.icon || 'check'}
                                                </div>
                                                <div className="text-[10px] text-stone-400">
                                                    Icon aktif
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setIconPickerTarget('form')}
                                            className="px-2.5 py-1 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 border border-stone-200 dark:border-stone-700 transition flex items-center gap-1.5"
                                        >
                                            <Search className="w-3.5 h-3.5" />
                                            <span>Ganti Icon</span>
                                        </button>
                                    </div>

                                    {/* Quick Picks */}
                                    <div>
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-1">
                                            Pilihan Cepat
                                        </label>
                                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                                            {[
                                                'check',
                                                'droplets',
                                                'book-open',
                                                'dumbbell',
                                                'brain',
                                                'sun',
                                                'moon',
                                                'heart',
                                                'coffee',
                                                'zap',
                                                'activity',
                                            ].map((iconKey) => (
                                                <button
                                                    key={iconKey}
                                                    type="button"
                                                    onClick={() => setData('icon', iconKey)}
                                                    className={`p-1.5 rounded-lg flex items-center justify-center border transition-all flex-shrink-0 ${
                                                        data.icon === iconKey
                                                            ? 'bg-amber-600 text-white border-amber-600'
                                                            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100'
                                                    }`}
                                                >
                                                    <Icons name={iconKey} className="w-4 h-4" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : editingHabit ? 'Simpan Perubahan' : 'Buat Habit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Guard Modal: Percobaan menandai di luar hari ini */}
            {guardModalInfo.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
                    <div className="bg-white dark:bg-stone-900 rounded-xl max-w-sm w-full p-5 border border-stone-200 dark:border-stone-800 shadow-xl text-center">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                            Tidak Dapat Menandai
                        </h3>
                        <p className="mt-1 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                            Penandaan habit hanya dapat dilakukan untuk hari ini (<strong>{filter_date}</strong>). Tanggal <strong>{guardModalInfo.targetDate}</strong> tidak dapat diubah.
                        </p>
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={() => setGuardModalInfo({ show: false, targetDate: '' })}
                                className="w-full py-1.5 px-4 rounded-lg text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 transition"
                            >
                                Mengerti
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Dynamic Icon Picker Modal with Query & Recent Cache */}
            <IconPickerModal
                show={iconPickerTarget !== null}
                onClose={() => setIconPickerTarget(null)}
                currentIcon={iconPickerTarget === 'form' ? data.icon : iconPickerTarget?.icon}
                onSelect={(chosenIcon) => {
                    if (iconPickerTarget === 'form') {
                        setData('icon', chosenIcon);
                    } else if (iconPickerTarget) {
                        saveInlineStyle(iconPickerTarget, undefined, chosenIcon);
                    }
                    setIconPickerTarget(null);
                }}
            />
        </AuthenticatedLayout>
    );
}
