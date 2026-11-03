import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDialog from '@/Components/ConfirmDialog';
import IconPickerModal from '@/Components/IconPickerModal';
import Icons from '@/Components/Icons';
import { Head, router } from '@inertiajs/react';
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
    ChevronRight as SubChevronRight,
} from 'lucide-react';
import { useMemo, useState } from 'react';

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
    const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
    const [timeSortOrder, setTimeSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
    const [guardModalInfo, setGuardModalInfo] = useState<{
        show: boolean;
        targetDate: string;
    }>({ show: false, targetDate: '' });
    const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

    const [isCreatingInline, setIsCreatingInline] = useState(false);
    const [inlineNameId, setInlineNameId] = useState<number | null>(null);
    const [inlineNameValue, setInlineNameValue] = useState<string>('');
    const [inlineDescId, setInlineDescId] = useState<number | null>(null);
    const [inlineDescValue, setInlineDescValue] = useState<string>('');
    const [activeStylePopoverId, setActiveStylePopoverId] = useState<number | null>(null);
    const [activeTypePopoverId, setActiveTypePopoverId] = useState<number | null>(null);
    const [activeTimePopoverId, setActiveTimePopoverId] = useState<number | null>(null);
    const [timeInputValue, setTimeInputValue] = useState<string>('');
    const [iconPickerTarget, setIconPickerTarget] = useState<'new_row' | HabitItem | null>(null);
    const [deletingHabit, setDeletingHabit] = useState<HabitItem | null>(null);
    const [isDeletingHabit, setIsDeletingHabit] = useState(false);

    // Quick inline new row state
    const [newRowData, setNewRowData] = useState<{
        name: string;
        color: string;
        icon: string;
        measurement_type: 'boolean' | 'quantitative' | 'duration';
        target_value: number | '';
        unit: string;
        time_of_day: string;
    }>({
        name: '',
        color: '#d97706',
        icon: 'check',
        measurement_type: 'boolean',
        target_value: 1,
        unit: '',
        time_of_day: '',
    });
    const [isSavingNewRow, setIsSavingNewRow] = useState(false);
    const [newRowTypePopover, setNewRowTypePopover] = useState(false);
    const [newRowStylePopover, setNewRowStylePopover] = useState(false);

    // Quick popover cell editor for quantitative / duration
    const [activeCellEdit, setActiveCellEdit] = useState<{
        habit: HabitItem;
        date: string;
        currentVal: number | '';
    } | null>(null);

    const startCreateInline = () => {
        setIsCreatingInline(true);
        setNewRowData({
            name: '',
            color: '#d97706',
            icon: 'check',
            measurement_type: 'boolean',
            target_value: 1,
            unit: '',
            time_of_day: '',
        });
        setNewRowTypePopover(false);
        setNewRowStylePopover(false);
    };

    const submitInlineNewRow = () => {
        const trimmed = newRowData.name.trim();
        if (!trimmed) {
            setIsCreatingInline(false);
            return;
        }

        setIsSavingNewRow(true);
        router.post(
            route('habits.store'),
            {
                name: trimmed,
                measurement_type: newRowData.measurement_type,
                target_value: Number(newRowData.target_value) || 1,
                unit: newRowData.measurement_type === 'boolean' ? '' : newRowData.unit || (newRowData.measurement_type === 'duration' ? 'menit' : 'kali'),
                frequency_type: 'daily',
                scheduled_days: [1, 2, 3, 4, 5, 6, 7],
                weekly_target_days: 5,
                start_date: filter_date,
                color: newRowData.color,
                icon: newRowData.icon,
                time_of_day: newRowData.time_of_day || null,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsCreatingInline(false);
                    setIsSavingNewRow(false);
                },
                onError: () => {
                    setIsSavingNewRow(false);
                },
            }
        );
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

    const saveInlineDesc = (habit: HabitItem) => {
        const trimmed = inlineDescValue.trim();
        if (trimmed !== (habit.description || '')) {
            router.put(
                route('habits.update', habit.id),
                { description: trimmed || null },
                { preserveScroll: true, preserveState: true }
            );
        }
        setInlineDescId(null);
    };

    const saveInlineTime = (habit: HabitItem, timeVal: string | null) => {
        router.put(
            route('habits.update', habit.id),
            { time_of_day: timeVal },
            { preserveScroll: true, preserveState: true }
        );
        setActiveTimePopoverId(null);
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
        setDeletingHabit(habit);
    };

    const confirmDeleteHabit = () => {
        if (!deletingHabit) return;
        setIsDeletingHabit(true);
        router.delete(route('habits.destroy', deletingHabit.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDeletingHabit(null);
                setIsDeletingHabit(false);
            },
            onError: () => {
                setIsDeletingHabit(false);
            },
        });
    };

    const filteredHabits = useMemo(() => {
        let result = habits.filter((h) => {
            const matchesSearch =
                searchQuery.trim() === '' ||
                h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (h.description && h.description.toLowerCase().includes(searchQuery.toLowerCase()));

            if (!matchesSearch) return false;

            if (timeFilter === 'morning') {
                return Boolean(h.time_of_day && h.time_of_day < '12:00');
            }
            if (timeFilter === 'afternoon') {
                return Boolean(h.time_of_day && h.time_of_day >= '12:00' && h.time_of_day < '17:00');
            }
            if (timeFilter === 'evening') {
                return Boolean(h.time_of_day && h.time_of_day >= '17:00');
            }

            return true;
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
    }, [habits, searchQuery, timeFilter, timeSortOrder]);

    const timeCounts = useMemo(() => {
        let morning = 0;
        let afternoon = 0;
        let evening = 0;
        habits.forEach((h) => {
            if (!h.time_of_day) return;
            if (h.time_of_day < '12:00') morning++;
            else if (h.time_of_day < '17:00') afternoon++;
            else evening++;
        });
        return {
            all: habits.length,
            morning,
            afternoon,
            evening,
        };
    }, [habits]);

    const todayCompletedCount = useMemo(() => {
        return habits.filter((h) => {
            const log = h.today_log || (filter_date ? h.week_logs?.[filter_date] : null);
            return log?.status === 'completed';
        }).length;
    }, [habits, filter_date]);

    const totalHabitsCount = habits.length;
    const completionPercentage = totalHabitsCount > 0 ? Math.round((todayCompletedCount / totalHabitsCount) * 100) : 0;

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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                            Habit Tracker
                        </h1>
                        <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                            Pantau konsistensi dan progres kebiasaan pekan ini.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 flex-nowrap overflow-x-auto">
                        {/* Week Navigator */}
                        <div className="flex items-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-0.5 text-xs font-medium shrink-0">
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
                            onClick={startCreateInline}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 transition whitespace-nowrap shrink-0"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Tambah Habit</span>
                        </button>
                    </div>
                </div>

                {/* Daily Progress Overview */}
                {!showing_archived && totalHabitsCount > 0 && (
                    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-3 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs tabular-nums">
                                {completionPercentage}%
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                                        Progres Hari Ini
                                    </span>
                                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                                        ({todayCompletedCount} dari {totalHabitsCount} selesai)
                                    </span>
                                </div>
                                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                                    {completionPercentage === 100
                                        ? 'Seluruh kebiasaan hari ini telah selesai.'
                                        : completionPercentage >= 50
                                        ? 'Sebagian besar target tercapai, lanjutkan sisa habit hari ini.'
                                        : 'Mulai tandai kebiasaan Anda untuk menjaga konsistensi.'}
                                </p>
                            </div>
                        </div>
                        <div className="w-full sm:w-56 flex items-center gap-2.5 shrink-0">
                            <div className="h-2 flex-1 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-300 ease-out rounded-full"
                                    style={{ width: `${completionPercentage}%` }}
                                />
                            </div>
                            <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 tabular-nums shrink-0">
                                {todayCompletedCount}/{totalHabitsCount}
                            </span>
                        </div>
                    </div>
                )}

                {/* Toolbar: Filter Waktu, Sorting & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    {/* Waktu Filter Tabs & Urutan */}
                    <div className="flex items-center gap-1.5 text-xs font-medium flex-nowrap overflow-x-auto py-0.5">
                        {(['all', 'morning', 'afternoon', 'evening'] as const).map((filterKey) => {
                            const label = {
                                all: 'Semua',
                                morning: 'Pagi',
                                afternoon: 'Siang',
                                evening: 'Malam',
                            }[filterKey];
                            const count = timeCounts[filterKey];
                            const isActive = timeFilter === filterKey;
                            return (
                                <button
                                    key={filterKey}
                                    type="button"
                                    onClick={() => setTimeFilter(filterKey)}
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition whitespace-nowrap shrink-0 ${
                                        isActive
                                            ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                                            : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                                    }`}
                                >
                                    <span>{label}</span>
                                    <span
                                        className={`text-[10px] tabular-nums rounded px-1 py-0.5 leading-none ${
                                            isActive
                                                ? 'bg-stone-700 text-stone-200 dark:bg-stone-300 dark:text-stone-800'
                                                : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                                        }`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            );
                        })}

                        <div className="h-4 w-px bg-stone-200 dark:bg-stone-800 mx-1 shrink-0" />

                        <span className="text-stone-400 dark:text-stone-500 flex items-center gap-1 whitespace-nowrap shrink-0 text-[11px]">
                            <Clock className="w-3 h-3" />
                            <span>Urut:</span>
                        </span>
                        <button
                            type="button"
                            onClick={() => setTimeSortOrder(timeSortOrder === 'asc' ? 'none' : 'asc')}
                            title="Urutkan dari jam paling awal"
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium transition whitespace-nowrap shrink-0 ${
                                timeSortOrder === 'asc'
                                    ? 'bg-amber-600 text-white border-amber-600'
                                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-850'
                            }`}
                        >
                            <ArrowUp className="w-3 h-3" />
                            <span>Awal</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setTimeSortOrder(timeSortOrder === 'desc' ? 'none' : 'desc')}
                            title="Urutkan dari jam paling akhir"
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium transition whitespace-nowrap shrink-0 ${
                                timeSortOrder === 'desc'
                                    ? 'bg-amber-600 text-white border-amber-600'
                                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-850'
                            }`}
                        >
                            <ArrowDown className="w-3 h-3" />
                            <span>Akhir</span>
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-64 shrink-0">
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
                {(activeStylePopoverId !== null || activeTypePopoverId !== null || activeTimePopoverId !== null || activeMenuId !== null || newRowTypePopover || newRowStylePopover) && (
                    <div
                        className="fixed inset-0 z-30 bg-transparent"
                        onClick={() => {
                            setActiveStylePopoverId(null);
                            setActiveTypePopoverId(null);
                            setActiveTimePopoverId(null);
                            setActiveMenuId(null);
                            setNewRowTypePopover(false);
                            setNewRowStylePopover(false);
                        }}
                    />
                )}

                {filteredHabits.length === 0 && !isCreatingInline ? (
                    <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                        <AlertCircle className="w-8 h-8 mx-auto text-stone-400 dark:text-stone-500" />
                        <h3 className="mt-2 text-sm font-semibold text-stone-800 dark:text-stone-200">
                            {searchQuery || timeFilter !== 'all' ? 'Tidak ada habit yang cocok' : 'Belum ada habit'}
                        </h3>
                        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                            {searchQuery || timeFilter !== 'all'
                                ? 'Coba sesuaikan filter waktu atau kata kunci pencarian.'
                                : 'Mulai rutinitas baru untuk mencatat konsistensi pekan ini.'}
                        </p>
                        {searchQuery || timeFilter !== 'all' ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('');
                                    setTimeFilter('all');
                                }}
                                className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 transition"
                            >
                                <span>Reset Filter</span>
                            </button>
                        ) : (
                            <button
                                onClick={startCreateInline}
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
                                        <th className="py-3 pl-5 pr-4 min-w-[280px]">Nama Kebiasaan</th>
                                        <th className="py-3 px-3 w-32 text-center whitespace-nowrap">Tipe / Target</th>
                                        {/* 7 Days Column */}
                                        {week_days.map((wd) => (
                                            <th
                                                key={wd.date}
                                                className={`py-3 px-2 text-center min-w-[58px] whitespace-nowrap ${
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
                                        <th className="py-3 px-3 w-28 text-center whitespace-nowrap">Progress Pekan</th>
                                        <th className="py-3 pr-4 pl-2 w-12 text-center whitespace-nowrap">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100 dark:divide-stone-800/70 text-xs">
                                    {/* Inline New Habit Row */}
                                    {isCreatingInline && (
                                        <tr className="bg-amber-500/[0.04] dark:bg-amber-500/[0.08] relative z-40 border-b border-amber-200 dark:border-amber-900/50">
                                            {/* Kolom Info Habit: Icon/Warna Picker + Input Nama */}
                                            <td className="py-2.5 pl-5 pr-4 relative">
                                                <div className="flex items-center gap-2.5">
                                                    {/* Color & Icon Trigger */}
                                                    <div className="relative">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setNewRowStylePopover(!newRowStylePopover);
                                                                setNewRowTypePopover(false);
                                                            }}
                                                            title="Pilih icon & warna"
                                                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-opacity hover:opacity-90 flex-shrink-0"
                                                            style={{ backgroundColor: newRowData.color }}
                                                        >
                                                            {renderHabitIcon(newRowData.icon)}
                                                        </button>

                                                        {newRowStylePopover && (
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
                                                                                onClick={() => {
                                                                                    setNewRowData({ ...newRowData, color: c.value });
                                                                                }}
                                                                                className={`w-6 h-6 rounded-full ${c.bg} flex items-center justify-center transition-all ${
                                                                                    newRowData.color === c.value ? 'ring-2 ring-offset-2 ' + c.ring : 'opacity-80'
                                                                                }`}
                                                                            >
                                                                                {newRowData.color === c.value && (
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
                                                                            const isSelected = newRowData.icon === iconKey;
                                                                            return (
                                                                                <button
                                                                                    key={iconKey}
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setNewRowData({ ...newRowData, icon: iconKey });
                                                                                    }}
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

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setIconPickerTarget('new_row');
                                                                            setNewRowStylePopover(false);
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

                                                    {/* Text Input Nama Habit & Waktu */}
                                                    <div className="flex-1 flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            autoFocus
                                                            value={newRowData.name}
                                                            onChange={(e) =>
                                                                setNewRowData({ ...newRowData, name: e.target.value })
                                                            }
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') submitInlineNewRow();
                                                                if (e.key === 'Escape') setIsCreatingInline(false);
                                                            }}
                                                            placeholder="Ketik nama habit baru... (tekan Enter untuk simpan)"
                                                            className="flex-1 text-xs font-medium text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 px-2.5 py-1.5 rounded-md border border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder:text-stone-400"
                                                        />
                                                        <div
                                                            className="flex items-center gap-1 bg-white dark:bg-stone-900 px-2 py-1.5 rounded-md border border-stone-200 dark:border-stone-700 shrink-0"
                                                            title="Waktu pelaksanaan (opsional, contoh 07:00)"
                                                        >
                                                            <Clock className="w-3 h-3 text-stone-400" />
                                                            <input
                                                                type="time"
                                                                value={newRowData.time_of_day}
                                                                onChange={(e) =>
                                                                    setNewRowData({ ...newRowData, time_of_day: e.target.value })
                                                                }
                                                                className="text-[11px] bg-transparent text-stone-700 dark:text-stone-300 focus:outline-none w-16"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Kolom Tipe / Target Selector */}
                                            <td className="py-2.5 px-3 text-center relative">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setNewRowTypePopover(!newRowTypePopover);
                                                        setNewRowStylePopover(false);
                                                    }}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-medium bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition"
                                                >
                                                    {newRowData.measurement_type === 'boolean' && (
                                                        <>
                                                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                                            <span>Ya/Tidak</span>
                                                        </>
                                                    )}
                                                    {newRowData.measurement_type === 'quantitative' && (
                                                        <>
                                                            <Hash className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                                            <span>
                                                                {newRowData.target_value} {newRowData.unit || 'kali'}
                                                            </span>
                                                        </>
                                                    )}
                                                    {newRowData.measurement_type === 'duration' && (
                                                        <>
                                                            <Clock className="w-3 h-3 text-stone-600 dark:text-stone-400" />
                                                            <span>
                                                                {newRowData.target_value} {newRowData.unit || 'menit'}
                                                            </span>
                                                        </>
                                                    )}
                                                </button>

                                                {newRowTypePopover && (
                                                    <div
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-60 p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-lg z-50 text-left space-y-2"
                                                    >
                                                        <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                                                            Pilih Tipe Target
                                                        </div>
                                                        <div className="flex flex-col gap-1.5">
                                                            {/* Option 1: Ya / Tidak */}
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setNewRowData({
                                                                        ...newRowData,
                                                                        measurement_type: 'boolean',
                                                                        target_value: 1,
                                                                        unit: '',
                                                                    });
                                                                    setNewRowTypePopover(false);
                                                                }}
                                                                className={`px-2.5 py-1.5 rounded-md text-xs font-medium text-left flex items-center gap-2 ${
                                                                    newRowData.measurement_type === 'boolean'
                                                                        ? 'bg-amber-600 text-white'
                                                                        : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                                                                }`}
                                                            >
                                                                <Check className="w-3.5 h-3.5" />
                                                                <span>Ya / Tidak</span>
                                                            </button>

                                                            {/* Option 2: Kuantitas Terukur (Nested on Hover) */}
                                                            <div className="relative group/qty">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setNewRowData({
                                                                            ...newRowData,
                                                                            measurement_type: 'quantitative',
                                                                            target_value: newRowData.measurement_type === 'quantitative' ? newRowData.target_value : 10,
                                                                            unit: newRowData.measurement_type === 'quantitative' && newRowData.unit ? newRowData.unit : 'kali',
                                                                        });
                                                                    }}
                                                                    className={`w-full px-2.5 py-1.5 rounded-md text-xs font-medium text-left flex items-center justify-between ${
                                                                        newRowData.measurement_type === 'quantitative'
                                                                            ? 'bg-amber-600 text-white'
                                                                            : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <Hash className="w-3.5 h-3.5" />
                                                                        <span>Kuantitas Terukur</span>
                                                                    </div>
                                                                    <SubChevronRight className="w-3.5 h-3.5 opacity-60" />
                                                                </button>

                                                                {/* Nested Flyout Card on Hover */}
                                                                <div className="hidden group-hover/qty:block absolute left-full -top-1.5 pl-4 z-50">
                                                                    <div className="w-64 p-3.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl text-left space-y-2.5 animate-in fade-in">
                                                                    <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                                                                        Konfigurasi Kuantitas
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        <div>
                                                                            <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                                                                                Target Angka
                                                                            </label>
                                                                            <input
                                                                                type="number"
                                                                                step="any"
                                                                                min={1}
                                                                                value={newRowData.target_value}
                                                                                onFocus={(e) => e.target.select()}
                                                                                onChange={(e) =>
                                                                                    setNewRowData({
                                                                                        ...newRowData,
                                                                                        measurement_type: 'quantitative',
                                                                                        target_value: e.target.value === '' ? '' : Number(e.target.value),
                                                                                    })
                                                                                }
                                                                                className="w-full text-xs bg-stone-50 dark:bg-stone-850 px-2 py-1 rounded border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                                                                                Satuan
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                value={newRowData.measurement_type === 'quantitative' ? newRowData.unit : 'kali'}
                                                                                onChange={(e) =>
                                                                                    setNewRowData({
                                                                                        ...newRowData,
                                                                                        measurement_type: 'quantitative',
                                                                                        unit: e.target.value,
                                                                                    })
                                                                                }
                                                                                placeholder="kali, ml, hal"
                                                                                className="w-full text-xs bg-stone-50 dark:bg-stone-850 px-2 py-1 rounded border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Presets Satuan Cepat */}
                                                                    <div>
                                                                        <div className="text-[9px] font-medium text-stone-400 mb-1">Pilihan Cepat:</div>
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {[
                                                                                { label: '8 Gelas', val: 8, unit: 'gelas' },
                                                                                { label: '2000 ml', val: 2000, unit: 'ml' },
                                                                                { label: '10 Hal', val: 10, unit: 'halaman' },
                                                                                { label: '5000 Langkah', val: 5000, unit: 'langkah' },
                                                                            ].map((preset, idx) => (
                                                                                <button
                                                                                    key={idx}
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setNewRowData({
                                                                                            ...newRowData,
                                                                                            measurement_type: 'quantitative',
                                                                                            target_value: preset.val,
                                                                                            unit: preset.unit,
                                                                                        });
                                                                                    }}
                                                                                    className="px-1.5 py-0.5 text-[10px] rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
                                                                                >
                                                                                    {preset.label}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setNewRowData({
                                                                                ...newRowData,
                                                                                measurement_type: 'quantitative',
                                                                                target_value: newRowData.measurement_type === 'quantitative' ? newRowData.target_value : 10,
                                                                                unit: newRowData.measurement_type === 'quantitative' && newRowData.unit ? newRowData.unit : 'kali',
                                                                            });
                                                                            setNewRowTypePopover(false);
                                                                        }}
                                                                        className="w-full py-1 text-center text-xs font-semibold rounded bg-amber-600 text-white hover:bg-amber-700 transition"
                                                                    >
                                                                        Terapkan Kuantitas
                                                                    </button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Option 3: Durasi Waktu (Nested on Hover) */}
                                                            <div className="relative group/dur">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setNewRowData({
                                                                            ...newRowData,
                                                                            measurement_type: 'duration',
                                                                            target_value: newRowData.measurement_type === 'duration' ? newRowData.target_value : 30,
                                                                            unit: newRowData.measurement_type === 'duration' && newRowData.unit ? newRowData.unit : 'menit',
                                                                        });
                                                                    }}
                                                                    className={`w-full px-2.5 py-1.5 rounded-md text-xs font-medium text-left flex items-center justify-between ${
                                                                        newRowData.measurement_type === 'duration'
                                                                            ? 'bg-amber-600 text-white'
                                                                            : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <Clock className="w-3.5 h-3.5" />
                                                                        <span>Durasi Waktu</span>
                                                                    </div>
                                                                    <SubChevronRight className="w-3.5 h-3.5 opacity-60" />
                                                                </button>

                                                                {/* Nested Flyout Card on Hover */}
                                                                <div className="hidden group-hover/dur:block absolute left-full -top-1.5 pl-4 z-50">
                                                                    <div className="w-60 p-3.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl text-left space-y-2.5 animate-in fade-in">
                                                                    <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                                                                        Konfigurasi Durasi
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        <div>
                                                                            <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                                                                                Target Durasi
                                                                            </label>
                                                                            <input
                                                                                type="number"
                                                                                step="any"
                                                                                min={1}
                                                                                value={newRowData.target_value}
                                                                                onFocus={(e) => e.target.select()}
                                                                                onChange={(e) =>
                                                                                    setNewRowData({
                                                                                        ...newRowData,
                                                                                        measurement_type: 'duration',
                                                                                        target_value: e.target.value === '' ? '' : Number(e.target.value),
                                                                                    })
                                                                                }
                                                                                className="w-full text-xs bg-stone-50 dark:bg-stone-850 px-2 py-1 rounded border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                                                                                Satuan
                                                                            </label>
                                                                            <select
                                                                                value={newRowData.measurement_type === 'duration' ? newRowData.unit : 'menit'}
                                                                                onChange={(e) =>
                                                                                    setNewRowData({
                                                                                        ...newRowData,
                                                                                        measurement_type: 'duration',
                                                                                        unit: e.target.value,
                                                                                    })
                                                                                }
                                                                                className="w-full text-xs bg-stone-50 dark:bg-stone-850 px-2 py-1 rounded border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                                                                            >
                                                                                <option value="menit">menit</option>
                                                                                <option value="jam">jam</option>
                                                                                <option value="detik">detik</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                    {/* Presets Durasi Cepat */}
                                                                    <div>
                                                                        <div className="text-[9px] font-medium text-stone-400 mb-1">Pilihan Cepat:</div>
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {[
                                                                                { label: '15 Menit', val: 15, unit: 'menit' },
                                                                                { label: '30 Menit', val: 30, unit: 'menit' },
                                                                                { label: '45 Menit', val: 45, unit: 'menit' },
                                                                                { label: '1 Jam', val: 1, unit: 'jam' },
                                                                            ].map((preset, idx) => (
                                                                                <button
                                                                                    key={idx}
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setNewRowData({
                                                                                            ...newRowData,
                                                                                            measurement_type: 'duration',
                                                                                            target_value: preset.val,
                                                                                            unit: preset.unit,
                                                                                        });
                                                                                    }}
                                                                                    className="px-1.5 py-0.5 text-[10px] rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
                                                                                >
                                                                                    {preset.label}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setNewRowData({
                                                                                ...newRowData,
                                                                                measurement_type: 'duration',
                                                                                target_value: newRowData.measurement_type === 'duration' ? newRowData.target_value : 30,
                                                                                unit: newRowData.measurement_type === 'duration' && newRowData.unit ? newRowData.unit : 'menit',
                                                                            });
                                                                            setNewRowTypePopover(false);
                                                                        }}
                                                                        className="w-full py-1 text-center text-xs font-semibold rounded bg-amber-600 text-white hover:bg-amber-700 transition"
                                                                    >
                                                                        Terapkan Durasi
                                                                    </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>

                                            {/* 7 Days Empty Placeholder Cells */}
                                            {week_days.map((wd) => (
                                                <td key={wd.date} className="py-2.5 px-1 text-center align-middle text-stone-300 dark:text-stone-700">
                                                    <span className="inline-block w-8 text-center text-xs select-none">-</span>
                                                </td>
                                            ))}

                                            {/* Progress Placeholder */}
                                            <td className="py-2.5 px-3 text-center text-stone-300 dark:text-stone-700">
                                                <span className="text-xs select-none">-</span>
                                            </td>

                                            {/* Aksi: Simpan / Batal */}
                                            <td className="py-2.5 pr-4 pl-2 text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={submitInlineNewRow}
                                                        disabled={isSavingNewRow}
                                                        title="Simpan (Enter)"
                                                        className="p-1 rounded-md text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition disabled:opacity-50"
                                                    >
                                                        <Check className="w-4 h-4 stroke-[2.5]" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsCreatingInline(false)}
                                                        disabled={isSavingNewRow}
                                                        title="Batal (Esc)"
                                                        className="p-1 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

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
                                            activeTimePopoverId === habit.id ||
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
                                                <td className={`py-3 pl-5 pr-4 ${activeStylePopoverId === habit.id || activeTimePopoverId === habit.id ? 'relative z-50' : ''}`}>
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
                                                                    setActiveTimePopoverId(null);
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

                                                        {/* Info Habit: Nama (inline rename), Waktu (inline popover), Catatan (inline edit) */}
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-1.5 flex-nowrap">
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
                                                                        className="text-xs font-semibold text-stone-900 dark:text-stone-100 bg-stone-50 dark:bg-stone-850 px-2 py-0.5 rounded-md border border-amber-600 focus:outline-none min-w-[130px] shrink-0"
                                                                    />
                                                                ) : (
                                                                    <div
                                                                        onClick={() => {
                                                                            setInlineNameId(habit.id);
                                                                            setInlineNameValue(habit.name);
                                                                        }}
                                                                        title="Klik untuk ubah nama"
                                                                        className="font-medium text-stone-900 dark:text-stone-100 flex items-center gap-1 cursor-pointer group shrink min-w-0"
                                                                    >
                                                                        <span className="group-hover:text-amber-600 transition-colors whitespace-nowrap overflow-hidden text-ellipsis">
                                                                            {habit.name}
                                                                        </span>
                                                                        <Edit3 className="w-2.5 h-2.5 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                                                    </div>
                                                                )}

                                                                {/* Popover Inline Atur Waktu */}
                                                                <div className="relative inline-block shrink-0">
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            if (activeTimePopoverId === habit.id) {
                                                                                setActiveTimePopoverId(null);
                                                                            } else {
                                                                                setActiveTimePopoverId(habit.id);
                                                                                setTimeInputValue(habit.time_of_day || '07:00');
                                                                            }
                                                                            setActiveStylePopoverId(null);
                                                                            setActiveTypePopoverId(null);
                                                                            setActiveMenuId(null);
                                                                        }}
                                                                        title={habit.time_of_day ? "Ubah waktu pelaksanaan" : "Atur waktu pelaksanaan"}
                                                                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium transition cursor-pointer whitespace-nowrap shrink-0 ${
                                                                            habit.time_of_day
                                                                                ? 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-500'
                                                                                : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-dashed border-stone-300 dark:border-stone-700'
                                                                        }`}
                                                                    >
                                                                        <Clock className="w-2.5 h-2.5 text-stone-500" />
                                                                        <span>{habit.time_of_day || '+ Waktu'}</span>
                                                                    </button>

                                                                    {activeTimePopoverId === habit.id && (
                                                                        <div
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            className="absolute left-0 top-full mt-1.5 w-56 p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl z-50 text-left space-y-2.5"
                                                                        >
                                                                            <div className="flex items-center justify-between pb-1.5 border-b border-stone-100 dark:border-stone-800">
                                                                                <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                                                                                    Waktu Pelaksanaan
                                                                                </span>
                                                                                {habit.time_of_day && (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => saveInlineTime(habit, null)}
                                                                                        className="text-[10px] text-rose-500 hover:underline font-medium"
                                                                                    >
                                                                                        Hapus
                                                                                    </button>
                                                                                )}
                                                                            </div>

                                                                            <div className="grid grid-cols-2 gap-1.5">
                                                                                {[
                                                                                    { label: 'Pagi', time: '07:00' },
                                                                                    { label: 'Siang', time: '12:00' },
                                                                                    { label: 'Sore', time: '17:00' },
                                                                                    { label: 'Malam', time: '20:00' },
                                                                                ].map((p) => (
                                                                                    <button
                                                                                        key={p.time}
                                                                                        type="button"
                                                                                        onClick={() => saveInlineTime(habit, p.time)}
                                                                                        className={`px-2 py-1 rounded text-xs font-medium border text-center transition ${
                                                                                            habit.time_of_day === p.time
                                                                                                ? 'bg-amber-600 text-white border-amber-600'
                                                                                                : 'border-stone-200 dark:border-stone-750 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                                                                                        }`}
                                                                                    >
                                                                                        {p.label} <span className="text-[10px] opacity-75">({p.time})</span>
                                                                                    </button>
                                                                                ))}
                                                                            </div>

                                                                            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center gap-1.5">
                                                                                <input
                                                                                    type="time"
                                                                                    value={timeInputValue}
                                                                                    onChange={(e) => setTimeInputValue(e.target.value)}
                                                                                    onKeyDown={(e) => {
                                                                                        if (e.key === 'Enter' && timeInputValue) {
                                                                                            saveInlineTime(habit, timeInputValue);
                                                                                        }
                                                                                    }}
                                                                                    className="flex-1 text-xs px-2 py-1 rounded border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                                                                                />
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        if (timeInputValue) {
                                                                                            saveInlineTime(habit, timeInputValue);
                                                                                        }
                                                                                    }}
                                                                                    className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-600 text-white hover:bg-amber-700 transition"
                                                                                >
                                                                                    Set
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {habit.is_archived && (
                                                                    <span className="text-[10px] font-medium text-stone-400 px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 whitespace-nowrap shrink-0">
                                                                        Arsip
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Catatan / Deskripsi Inline */}
                                                            {inlineDescId === habit.id ? (
                                                                <input
                                                                    type="text"
                                                                    autoFocus
                                                                    value={inlineDescValue}
                                                                    onChange={(e) => setInlineDescValue(e.target.value)}
                                                                    onBlur={() => saveInlineDesc(habit)}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') saveInlineDesc(habit);
                                                                        if (e.key === 'Escape') setInlineDescId(null);
                                                                    }}
                                                                    placeholder="Tulis catatan habit... (Enter untuk simpan)"
                                                                    className="w-full text-[11px] text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-850 px-2 py-0.5 rounded border border-amber-600 focus:outline-none mt-1"
                                                                />
                                                            ) : (
                                                                <div
                                                                    onClick={() => {
                                                                        setInlineDescId(habit.id);
                                                                        setInlineDescValue(habit.description || '');
                                                                    }}
                                                                    title="Klik untuk ubah catatan"
                                                                    className="text-[11px] text-stone-400 dark:text-stone-500 truncate cursor-pointer hover:text-stone-600 dark:hover:text-stone-300 mt-0.5 max-w-[280px]"
                                                                >
                                                                    {habit.description || (
                                                                        <span className="opacity-0 group-hover:opacity-100 text-[10px] text-stone-400 italic">
                                                                            + Tambah catatan
                                                                        </span>
                                                                    )}
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
                                                            setActiveTimePopoverId(null);
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
                                                            className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-60 p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-lg z-50 text-left space-y-2"
                                                        >
                                                            <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                                                                Ganti Tipe Target
                                                            </div>
                                                            <div className="flex flex-col gap-1.5">
                                                                {/* Option 1: Ya / Tidak */}
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

                                                                {/* Option 2: Kuantitas Terukur (Nested on Hover) */}
                                                                <div className="relative group/editqty">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            saveInlineTarget(
                                                                                habit,
                                                                                'quantitative',
                                                                                habit.measurement_type === 'quantitative' ? habit.target_value : 10,
                                                                                habit.measurement_type === 'quantitative' && habit.unit ? habit.unit : 'kali'
                                                                            )
                                                                        }
                                                                        className={`w-full px-2.5 py-1.5 rounded-md text-xs font-medium text-left flex items-center justify-between ${
                                                                            habit.measurement_type === 'quantitative'
                                                                                ? 'bg-amber-600 text-white'
                                                                                : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <Hash className="w-3.5 h-3.5" />
                                                                            <span>Kuantitas Terukur</span>
                                                                        </div>
                                                                        <SubChevronRight className="w-3.5 h-3.5 opacity-60" />
                                                                    </button>

                                                                    {/* Nested Flyout Card on Hover */}
                                                                    <div className="hidden group-hover/editqty:block absolute left-full -top-1.5 pl-4 z-50">
                                                                        <div className="w-64 p-3.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl text-left space-y-2.5 animate-in fade-in">
                                                                            <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                                                                                Konfigurasi Kuantitas
                                                                            </div>
                                                                            <div className="grid grid-cols-2 gap-2">
                                                                                <div>
                                                                                    <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                                                                                        Target Angka
                                                                                    </label>
                                                                                    <input
                                                                                        type="number"
                                                                                        step="any"
                                                                                        min={1}
                                                                                        defaultValue={habit.measurement_type === 'quantitative' ? habit.target_value : 10}
                                                                                        onFocus={(e) => e.target.select()}
                                                                                        id={`qty-val-${habit.id}`}
                                                                                        className="w-full text-xs bg-stone-50 dark:bg-stone-850 px-2 py-1 rounded border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                                                                                        Satuan
                                                                                    </label>
                                                                                    <input
                                                                                        type="text"
                                                                                        defaultValue={habit.measurement_type === 'quantitative' && habit.unit ? habit.unit : 'kali'}
                                                                                        id={`qty-unit-${habit.id}`}
                                                                                        placeholder="kali, ml, hal"
                                                                                        className="w-full text-xs bg-stone-50 dark:bg-stone-850 px-2 py-1 rounded border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            {/* Presets Satuan Cepat */}
                                                                            <div>
                                                                                <div className="text-[9px] font-medium text-stone-400 mb-1">Pilihan Cepat:</div>
                                                                                <div className="flex flex-wrap gap-1">
                                                                                    {[
                                                                                        { label: '8 Gelas', val: 8, unit: 'gelas' },
                                                                                        { label: '2000 ml', val: 2000, unit: 'ml' },
                                                                                        { label: '10 Hal', val: 10, unit: 'halaman' },
                                                                                        { label: '5000 Langkah', val: 5000, unit: 'langkah' },
                                                                                    ].map((preset, idx) => (
                                                                                        <button
                                                                                            key={idx}
                                                                                            type="button"
                                                                                            onClick={() => {
                                                                                                const inputVal = document.getElementById(`qty-val-${habit.id}`) as HTMLInputElement;
                                                                                                const inputUnit = document.getElementById(`qty-unit-${habit.id}`) as HTMLInputElement;
                                                                                                if (inputVal) inputVal.value = String(preset.val);
                                                                                                if (inputUnit) inputUnit.value = preset.unit;
                                                                                            }}
                                                                                            className="px-1.5 py-0.5 text-[10px] rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
                                                                                        >
                                                                                            {preset.label}
                                                                                        </button>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    const inputVal = document.getElementById(`qty-val-${habit.id}`) as HTMLInputElement;
                                                                                    const inputUnit = document.getElementById(`qty-unit-${habit.id}`) as HTMLInputElement;
                                                                                    const tVal = Number(inputVal?.value) || 1;
                                                                                    const uVal = inputUnit?.value?.trim() || 'kali';
                                                                                    saveInlineTarget(habit, 'quantitative', tVal, uVal);
                                                                                }}
                                                                                className="w-full py-1 text-center text-xs font-semibold rounded bg-amber-600 text-white hover:bg-amber-700 transition"
                                                                            >
                                                                                Terapkan Kuantitas
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Option 3: Durasi Waktu (Nested on Hover) */}
                                                                <div className="relative group/editdur">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            saveInlineTarget(
                                                                                habit,
                                                                                'duration',
                                                                                habit.measurement_type === 'duration' ? habit.target_value : 30,
                                                                                habit.measurement_type === 'duration' && habit.unit ? habit.unit : 'menit'
                                                                            )
                                                                        }
                                                                        className={`w-full px-2.5 py-1.5 rounded-md text-xs font-medium text-left flex items-center justify-between ${
                                                                            habit.measurement_type === 'duration'
                                                                                ? 'bg-amber-600 text-white'
                                                                                : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <Clock className="w-3.5 h-3.5" />
                                                                            <span>Durasi Waktu</span>
                                                                        </div>
                                                                        <SubChevronRight className="w-3.5 h-3.5 opacity-60" />
                                                                    </button>

                                                                    {/* Nested Flyout Card on Hover */}
                                                                    <div className="hidden group-hover/editdur:block absolute left-full -top-1.5 pl-4 z-50">
                                                                        <div className="w-60 p-3.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl text-left space-y-2.5 animate-in fade-in">
                                                                            <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                                                                                Konfigurasi Durasi
                                                                            </div>
                                                                            <div className="grid grid-cols-2 gap-2">
                                                                                <div>
                                                                                    <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                                                                                        Target Durasi
                                                                                    </label>
                                                                                    <input
                                                                                        type="number"
                                                                                        step="any"
                                                                                        min={1}
                                                                                        defaultValue={habit.measurement_type === 'duration' ? habit.target_value : 30}
                                                                                        onFocus={(e) => e.target.select()}
                                                                                        id={`dur-val-${habit.id}`}
                                                                                        className="w-full text-xs bg-stone-50 dark:bg-stone-850 px-2 py-1 rounded border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <label className="block text-[10px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                                                                                        Satuan
                                                                                    </label>
                                                                                    <select
                                                                                        defaultValue={habit.measurement_type === 'duration' && habit.unit ? habit.unit : 'menit'}
                                                                                        id={`dur-unit-${habit.id}`}
                                                                                        className="w-full text-xs bg-stone-50 dark:bg-stone-850 px-2 py-1 rounded border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                                                                                    >
                                                                                        <option value="menit">menit</option>
                                                                                        <option value="jam">jam</option>
                                                                                        <option value="detik">detik</option>
                                                                                    </select>
                                                                                </div>
                                                                            </div>

                                                                            {/* Presets Durasi Cepat */}
                                                                            <div>
                                                                                <div className="text-[9px] font-medium text-stone-400 mb-1">Pilihan Cepat:</div>
                                                                                <div className="flex flex-wrap gap-1">
                                                                                    {[
                                                                                        { label: '15 Menit', val: 15, unit: 'menit' },
                                                                                        { label: '30 Menit', val: 30, unit: 'menit' },
                                                                                        { label: '45 Menit', val: 45, unit: 'menit' },
                                                                                        { label: '1 Jam', val: 1, unit: 'jam' },
                                                                                    ].map((preset, idx) => (
                                                                                        <button
                                                                                            key={idx}
                                                                                            type="button"
                                                                                            onClick={() => {
                                                                                                const inputVal = document.getElementById(`dur-val-${habit.id}`) as HTMLInputElement;
                                                                                                const inputUnit = document.getElementById(`dur-unit-${habit.id}`) as HTMLSelectElement;
                                                                                                if (inputVal) inputVal.value = String(preset.val);
                                                                                                if (inputUnit) inputUnit.value = preset.unit;
                                                                                            }}
                                                                                            className="px-1.5 py-0.5 text-[10px] rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
                                                                                        >
                                                                                            {preset.label}
                                                                                        </button>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    const inputVal = document.getElementById(`dur-val-${habit.id}`) as HTMLInputElement;
                                                                                    const inputUnit = document.getElementById(`dur-unit-${habit.id}`) as HTMLSelectElement;
                                                                                    const tVal = Number(inputVal?.value) || 1;
                                                                                    const uVal = inputUnit?.value || 'menit';
                                                                                    saveInlineTarget(habit, 'duration', tVal, uVal);
                                                                                }}
                                                                                className="w-full py-1 text-center text-xs font-semibold rounded bg-amber-600 text-white hover:bg-amber-700 transition"
                                                                            >
                                                                                Terapkan Durasi
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
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
                                                            setActiveTimePopoverId(null);
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
                                                                onClick={() => {
                                                                    setActiveTimePopoverId(habit.id);
                                                                    setTimeInputValue(habit.time_of_day || '07:00');
                                                                    setActiveMenuId(null);
                                                                }}
                                                                className="flex items-center gap-2 w-full px-3 py-2 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                                                            >
                                                                <Clock className="w-3.5 h-3.5 text-stone-400" />
                                                                <span>Atur Waktu</span>
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
                                    onClick={() => {
                                        const current = typeof activeCellEdit.currentVal === 'number' ? activeCellEdit.currentVal : 0;
                                        setActiveCellEdit({
                                            ...activeCellEdit,
                                            currentVal: Math.max(0, current - 1),
                                        });
                                    }}
                                    className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold hover:bg-stone-200 dark:hover:bg-stone-750 transition"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <input
                                    type="number"
                                    step="any"
                                    value={activeCellEdit.currentVal}
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) =>
                                        setActiveCellEdit({
                                            ...activeCellEdit,
                                            currentVal: e.target.value === '' ? '' : Number(e.target.value),
                                        })
                                    }
                                    className="flex-1 text-center font-semibold text-base py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const current = typeof activeCellEdit.currentVal === 'number' ? activeCellEdit.currentVal : 0;
                                        setActiveCellEdit({
                                            ...activeCellEdit,
                                            currentVal: current + 1,
                                        });
                                    }}
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
                                            const current = typeof activeCellEdit.currentVal === 'number' ? activeCellEdit.currentVal : 0;
                                            const next = preset.val === 0 ? 0 : current + preset.val;
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
                                onClick={() => saveCellLog(Number(activeCellEdit.currentVal) || 0)}
                                className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-md transition"
                            >
                                Simpan Capaian
                            </button>
                        </div>
                    </div>
                </div>
            )}



            {/* Delete Habit Confirmation Dialog */}
            <ConfirmDialog
                show={deletingHabit !== null}
                onClose={() => {
                    if (!isDeletingHabit) setDeletingHabit(null);
                }}
                onConfirm={confirmDeleteHabit}
                title="Hapus Kebiasaan"
                message={
                    <>
                        Apakah Anda yakin ingin menghapus kebiasaan{' '}
                        <strong className="text-stone-900 dark:text-stone-100">
                            &ldquo;{deletingHabit?.name}&rdquo;
                        </strong>
                        ? Seluruh riwayat dan log capaian kebiasaan ini akan
                        dihapus secara permanen.
                    </>
                }
                confirmText="Hapus Kebiasaan"
                cancelText="Batal"
                variant="danger"
                processing={isDeletingHabit}
            />

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
                currentIcon={
                    iconPickerTarget === 'new_row'
                        ? newRowData.icon
                        : typeof iconPickerTarget === 'object' && iconPickerTarget !== null
                        ? iconPickerTarget.icon
                        : 'check'
                }
                onSelect={(chosenIcon) => {
                    if (iconPickerTarget === 'new_row') {
                        setNewRowData({ ...newRowData, icon: chosenIcon });
                    } else if (iconPickerTarget && typeof iconPickerTarget === 'object') {
                        saveInlineStyle(iconPickerTarget, undefined, chosenIcon);
                    }
                    setIconPickerTarget(null);
                }}
            />
        </AuthenticatedLayout>
    );
}
