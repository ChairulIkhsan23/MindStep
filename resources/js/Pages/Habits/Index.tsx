import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Check, Flame, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

export default function HabitsIndex() {
    const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'archived'>('all');

    return (
        <AuthenticatedLayout>
            <Head title="Habit Tracker - MindStep" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200/90 dark:border-stone-800">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                                Manajemen Kebiasaan
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
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-850 shadow-sm">
                            <SlidersHorizontal className="w-4 h-4 text-stone-400" />
                            <span>Filter</span>
                        </button>
                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm shadow-amber-600/20">
                            <Plus className="w-4 h-4" />
                            <span>Tambah Habit</span>
                        </button>
                    </div>
                </div>

                {/* Filter Tabs & Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                        <button
                            onClick={() => setSelectedTab('all')}
                            className={`px-3 py-1.5 rounded-full transition-all ${
                                selectedTab === 'all'
                                    ? 'bg-amber-600 text-white shadow-sm'
                                    : 'bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-850'
                            }`}
                        >
                            Semua Habit (6)
                        </button>
                        <button
                            onClick={() => setSelectedTab('active')}
                            className={`px-3 py-1.5 rounded-full transition-all ${
                                selectedTab === 'active'
                                    ? 'bg-amber-600 text-white shadow-sm'
                                    : 'bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-850'
                            }`}
                        >
                            Sedang Aktif (5)
                        </button>
                        <button
                            onClick={() => setSelectedTab('archived')}
                            className={`px-3 py-1.5 rounded-full transition-all ${
                                selectedTab === 'archived'
                                    ? 'bg-amber-600 text-white shadow-sm'
                                    : 'bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-850'
                            }`}
                        >
                            Diarsipkan (1)
                        </button>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Cari habit..."
                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-stone-900 rounded-xl border border-stone-200/90 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-amber-600"
                        />
                    </div>
                </div>

                {/* Habit Cards List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        {
                            title: 'Meditasi Pagi & Pernapasan',
                            cat: 'Kebugaran Pikiran',
                            streak: 18,
                            time: '06:30 WIB',
                            status: 'Selesai Hari Ini',
                            completed: true,
                        },
                        {
                            title: 'Membaca Buku (Atomic Habits)',
                            cat: 'Pengembangan Diri',
                            streak: 12,
                            time: '20 Halaman/hari',
                            status: '12 / 20 Halaman',
                            completed: false,
                        },
                        {
                            title: 'Olahraga Ringan Kardio',
                            cat: 'Kesehatan Tubuh',
                            streak: 6,
                            time: '17:00 WIB',
                            status: 'Belum Selesai',
                            completed: false,
                        },
                        {
                            title: 'Minum Air Mineral 2.5L',
                            cat: 'Hidrasi Sehat',
                            streak: 15,
                            time: 'Target 2500 ml',
                            status: '1800 / 2500 ml',
                            completed: false,
                        },
                        {
                            title: 'Journaling Malam & Evaluasi',
                            cat: 'Refleksi Harian',
                            streak: 18,
                            time: '21:00 WIB',
                            status: 'Terjadwal Nanti Malam',
                            completed: false,
                        },
                        {
                            title: 'Tidur Berkualitas Sebelum 23:00',
                            cat: 'Kesehatan Tidur',
                            streak: 9,
                            time: '22:30 WIB',
                            status: 'Terjadwal',
                            completed: false,
                        },
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-5 shadow-sm hover:border-amber-300 dark:hover:border-amber-800/80 transition-all flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                                        {item.cat}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                                        <Flame className="w-3.5 h-3.5" />
                                        <span>{item.streak} Hari</span>
                                    </div>
                                </div>

                                <h3 className="mt-3 text-sm font-bold text-stone-900 dark:text-stone-100">
                                    {item.title}
                                </h3>
                                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{item.time}</p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-stone-200/90 dark:border-stone-800 flex items-center justify-between">
                                <span className={`text-xs font-semibold ${item.completed ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-500 dark:text-stone-400'}`}>
                                    {item.status}
                                </span>
                                <button
                                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                                        item.completed
                                            ? 'bg-emerald-600 text-white'
                                            : 'border-2 border-stone-300 dark:border-stone-700 hover:border-amber-600 text-transparent hover:text-amber-600'
                                    }`}
                                >
                                    <Check className="w-4 h-4 stroke-[3]" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
