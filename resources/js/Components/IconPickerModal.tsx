import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { iconNames } from 'lucide-react/dynamic';
import { useDeferredValue, useMemo, useState } from 'react';
import Icons from './Icons';

interface Props {
    show: boolean;
    onClose: () => void;
    onSelect: (iconName: string) => void;
    currentIcon?: string | null;
}

const ITEMS_PER_PAGE = 48;

export default function IconPickerModal({
    show,
    onClose,
    onSelect,
    currentIcon,
}: Props) {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const deferredSearch = useDeferredValue(search);

    const filteredIcons = useMemo(() => {
        const query = deferredSearch.trim().toLowerCase();
        if (!query) {
            return iconNames;
        }
        return iconNames.filter((name) => name.toLowerCase().includes(query));
    }, [deferredSearch]);

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
        onSelect(name);
        onClose();
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="xl">
            <div className="p-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Pilih Ikon Kebiasaan
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {iconNames.length.toLocaleString()} ikon tersedia dari perpustakaan Lucide
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md p-1 text-gray-400 hover:text-gray-500 focus:outline-none dark:hover:text-gray-300"
                    >
                        ✕
                    </button>
                </div>

                <div className="mt-4">
                    <TextInput
                        type="search"
                        placeholder="Cari ikon (contoh: water, run, book, heart, coffee)..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full text-sm"
                        autoFocus
                    />
                </div>

                <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>
                            Menemukan {filteredIcons.length.toLocaleString()} ikon
                        </span>
                        <span>
                            Halaman {currentPage} dari {totalPages}
                        </span>
                    </div>

                    <div className="mt-3 grid max-h-72 grid-cols-6 gap-2 overflow-y-auto rounded-lg border border-gray-200 p-3 sm:grid-cols-8 dark:border-gray-700 dark:bg-gray-900/50">
                        {paginatedIcons.map((name) => {
                            const isSelected = currentIcon === name;
                            return (
                                <button
                                    key={name}
                                    type="button"
                                    onClick={() => handleSelect(name)}
                                    title={name}
                                    className={`group flex flex-col items-center justify-center rounded-lg p-2.5 transition-colors ${
                                        isSelected
                                            ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500 dark:bg-indigo-950 dark:text-indigo-300'
                                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    <Icons name={name} className="h-6 w-6" />
                                    <span className="mt-1 max-w-[50px] truncate text-[9px] text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-200">
                                        {name}
                                    </span>
                                </button>
                            );
                        })}

                        {paginatedIcons.length === 0 && (
                            <div className="col-span-full py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                Tidak ada ikon yang cocok dengan kata kunci &quot;{search}&quot;.
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
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
