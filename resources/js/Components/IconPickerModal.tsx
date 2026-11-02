import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { iconNames } from 'lucide-react/dynamic';
import { memo, useDeferredValue, useEffect, useMemo, useState } from 'react';
import Icons from './Icons';

interface Props {
    show: boolean;
    onClose: () => void;
    onSelect: (iconName: string) => void;
    currentIcon?: string | null;
}

const ITEMS_PER_PAGE = 48;
const RECENT_ICONS_STORAGE_KEY = 'mindstep_recent_icons';
const ALL_ICONS_CACHE_KEY = 'mindstep_lucide_all_icons_cache';
const DEFAULT_RECENT_ICONS = [
    'check',
    'droplets',
    'book-open',
    'dumbbell',
    'brain',
    'moon',
    'sun',
    'heart',
    'coffee',
    'zap',
    'sparkles',
    'activity',
];

// In-Memory cache for all 2,275 icon names & query filter cache
let inMemoryAllIcons: string[] | null = null;
const searchCache = new Map<string, string[]>();

function getAllCachedIcons(): string[] {
    if (inMemoryAllIcons && inMemoryAllIcons.length > 0) {
        return inMemoryAllIcons;
    }
    try {
        const stored = localStorage.getItem(ALL_ICONS_CACHE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                inMemoryAllIcons = parsed;
                return parsed;
            }
        }
    } catch {
        // ignore storage error
    }

    const all = iconNames as unknown as string[];
    inMemoryAllIcons = all;
    try {
        localStorage.setItem(ALL_ICONS_CACHE_KEY, JSON.stringify(all));
    } catch {
        // ignore quota error
    }
    return all;
}

const IconItem = memo(function IconItem({
    name,
    isSelected,
    onSelect,
}: {
    name: string;
    isSelected: boolean;
    onSelect: (name: string) => void;
}) {
    return (
        <button
            type="button"
            onClick={() => onSelect(name)}
            title={name}
            className={`group flex flex-col items-center justify-center rounded-xl p-2.5 transition-all text-center ${
                isSelected
                    ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-600 ring-offset-2 dark:ring-offset-stone-900'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 dark:bg-stone-850 dark:text-stone-300 dark:hover:bg-stone-800 border border-stone-200/80 dark:border-stone-800'
            }`}
        >
            <Icons
                name={name}
                className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-stone-700 dark:text-stone-300 group-hover:text-amber-600'}`}
            />
            <span
                className={`mt-1.5 max-w-[56px] truncate text-[9px] font-medium leading-none ${
                    isSelected ? 'text-white' : 'text-stone-400 group-hover:text-stone-800 dark:group-hover:text-stone-200'
                }`}
            >
                {name}
            </span>
        </button>
    );
});

export default function IconPickerModal({
    show,
    onClose,
    onSelect,
    currentIcon,
}: Props) {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [recentIcons, setRecentIcons] = useState<string[]>(DEFAULT_RECENT_ICONS);
    const deferredSearch = useDeferredValue(search);

    // Cache all 2,275 icon names on mount
    const allCachedIcons = useMemo(() => getAllCachedIcons(), []);

    // Load recent icons from localStorage on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem(RECENT_ICONS_STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setRecentIcons(parsed);
                }
            }
        } catch {
            // ignore localStorage read errors
        }
    }, []);

    // Filtered icons with query caching over the cached 2,275 icon collection
    const filteredIcons = useMemo(() => {
        const query = deferredSearch.trim().toLowerCase();
        if (!query) {
            return allCachedIcons;
        }

        // Check in-memory query cache
        if (searchCache.has(query)) {
            return searchCache.get(query)!;
        }

        // Compute and store in cache
        const results = allCachedIcons.filter((name) =>
            name.toLowerCase().includes(query)
        );
        searchCache.set(query, results);
        return results;
    }, [deferredSearch, allCachedIcons]);

    const totalPages = Math.max(1, Math.ceil(filteredIcons.length / ITEMS_PER_PAGE));
    const currentPage = Math.min(page, totalPages);

    const paginatedIcons = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredIcons.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredIcons, currentPage]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleSelect = (name: string) => {
        // Update recent icons list in localStorage
        try {
            const updated = [name, ...recentIcons.filter((n) => n !== name)].slice(0, 16);
            setRecentIcons(updated);
            localStorage.setItem(RECENT_ICONS_STORAGE_KEY, JSON.stringify(updated));
        } catch {
            // ignore localStorage write errors
        }

        onSelect(name);
        onClose();
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3.5 dark:border-stone-800">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                                Pilih Icon Kebiasaan (Lucide)
                            </h2>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                                ⚡ {allCachedIcons.length.toLocaleString()} Icon Cached
                            </span>
                        </div>
                        <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                            Semua {allCachedIcons.length.toLocaleString()} icon telah di-cache untuk pencarian dan pemuatan instan.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mt-4">
                    <TextInput
                        type="search"
                        placeholder="Cari icon (contoh: water, run, book, heart, coffee, dumbbell)..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full text-xs sm:text-sm bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800 rounded-xl"
                        autoFocus
                    />
                </div>

                {/* Recent Section */}
                {!search.trim() && recentIcons.length > 0 && (
                    <div className="mt-3.5 pt-2 border-t border-stone-100 dark:border-stone-800/60">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block mb-2">
                            Recent
                        </label>
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                            {recentIcons.map((rec) => {
                                const isSelected = currentIcon === rec;
                                return (
                                    <button
                                        key={rec}
                                        type="button"
                                        onClick={() => handleSelect(rec)}
                                        title={rec}
                                        className={`flex-shrink-0 p-2 rounded-xl flex items-center justify-center border transition-all ${
                                            isSelected
                                                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                                                : 'bg-stone-50 dark:bg-stone-850 border-stone-200/80 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                                        }`}
                                    >
                                        <Icons name={rec} className="w-4 h-4" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Results count & page header */}
                <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                        <span>
                            Ditemukan {filteredIcons.length.toLocaleString()} icon (Cached)
                        </span>
                        <span>
                            Halaman {currentPage} dari {totalPages}
                        </span>
                    </div>

                    {/* Icon Grid */}
                    <div className="mt-2.5 grid max-h-72 grid-cols-4 gap-2 overflow-y-auto rounded-xl border border-stone-200 p-3 sm:grid-cols-6 md:grid-cols-8 dark:border-stone-800 dark:bg-stone-900/50">
                        {paginatedIcons.map((name) => (
                            <IconItem
                                key={name}
                                name={name}
                                isSelected={currentIcon === name}
                                onSelect={handleSelect}
                            />
                        ))}

                        {paginatedIcons.length === 0 && (
                            <div className="col-span-full py-10 text-center text-xs text-stone-400">
                                Tidak ada icon yang cocok dengan kata kunci &quot;{search}&quot;.
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Pagination */}
                <div className="mt-4 flex items-center justify-between border-t border-stone-200 pt-3 dark:border-stone-800">
                    <div className="flex gap-2">
                        <SecondaryButton
                            type="button"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage <= 1}
                            className="text-xs"
                        >
                            &larr; Sebelumnya
                        </SecondaryButton>
                        <SecondaryButton
                            type="button"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage >= totalPages}
                            className="text-xs"
                        >
                            Berikutnya &rarr;
                        </SecondaryButton>
                    </div>

                    <SecondaryButton type="button" onClick={onClose} className="text-xs">
                        Tutup
                    </SecondaryButton>
                </div>
            </div>
        </Modal>
    );
}
