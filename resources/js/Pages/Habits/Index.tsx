import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Calendar,
    Check,
    CheckCircle2,
    Flame,
    Plus,
    Search,
    SlidersHorizontal,
    TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

export default function HabitsIndex() {
    const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'archived'>('all');

    return (
        <AuthenticatedLayout>
            <Head title="Habit Tracker - MindStep" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-[#EFF6FF] text-[#1D63ED] border border-[#DBEAFE]">
                                Manajemen Kebiasaan
                            </span>
                        </div>
                        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0F172A]">
                            Habit Tracker
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
                            Bangun dan pantau konsistensi rutinitas harianmu selangkah demi selangkah.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#0F172A] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] shadow-sm">
                            <SlidersHorizontal className="w-4 h-4 text-[#64748B]" />
                            <span>Filter</span>
                        </button>
                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#1D63ED] hover:bg-[#1E40AF] shadow-sm shadow-[#1D63ED]/20">
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
                                    ? 'bg-[#1D63ED] text-white shadow-sm'
                                    : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
                            }`}
                        >
                            Semua Habit (6)
                        </button>
                        <button
                            onClick={() => setSelectedTab('active')}
                            className={`px-3 py-1.5 rounded-full transition-all ${
                                selectedTab === 'active'
                                    ? 'bg-[#1D63ED] text-white shadow-sm'
                                    : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
                            }`}
                        >
                            Sedang Aktif (5)
                        </button>
                        <button
                            onClick={() => setSelectedTab('archived')}
                            className={`px-3 py-1.5 rounded-full transition-all ${
                                selectedTab === 'archived'
                                    ? 'bg-[#1D63ED] text-white shadow-sm'
                                    : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
                            }`}
                        >
                            Diarsipkan (1)
                        </button>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Cari habit..."
                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:border-[#1D63ED]"
                        />
                    </div>
                </div>

                {/* Mockup Habit Cards List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        {
                            title: 'Meditasi Pagi & Pernapasan',
                            cat: 'Kebugaran Pikiran',
                            streak: 18,
                            time: '06:30 WIB',
                            color: 'bg-emerald-500',
                            status: 'Selesai Hari Ini',
                            completed: true,
                        },
                        {
                            title: 'Membaca Buku (Atomic Habits)',
                            cat: 'Pengembangan Diri',
                            streak: 12,
                            time: '20 Halaman/hari',
                            color: 'bg-[#1D63ED]',
                            status: '12 / 20 Halaman',
                            completed: false,
                        },
                        {
                            title: 'Olahraga Ringan Kardio',
                            cat: 'Kesehatan Tubuh',
                            streak: 6,
                            time: '17:00 WIB',
                            color: 'bg-indigo-500',
                            status: 'Belum Selesai',
                            completed: false,
                        },
                        {
                            title: 'Minum Air Mineral 2.5L',
                            cat: 'Hidrasi Sehat',
                            streak: 15,
                            time: 'Target 2500 ml',
                            color: 'bg-sky-500',
                            status: '1800 / 2500 ml',
                            completed: false,
                        },
                        {
                            title: 'Journaling Malam & Evaluasi',
                            cat: 'Refleksi Harian',
                            streak: 18,
                            time: '21:00 WIB',
                            color: 'bg-indigo-600',
                            status: 'Terjadwal Nanti Malam',
                            completed: false,
                        },
                        {
                            title: 'Tidur Berkualitas Sebelum 23:00',
                            cat: 'Kesehatan Tidur',
                            streak: 9,
                            time: '22:30 WIB',
                            color: 'bg-purple-500',
                            status: 'Terjadwal',
                            completed: false,
                        },
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm hover:border-[#DBEAFE] hover:shadow-md transition-all flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#64748B]">
                                        {item.cat}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs font-bold text-[#D97706]">
                                        <Flame className="w-3.5 h-3.5" />
                                        <span>{item.streak} Hari</span>
                                    </div>
                                </div>

                                <h3 className="mt-3 text-sm font-bold text-[#0F172A]">
                                    {item.title}
                                </h3>
                                <p className="mt-1 text-xs text-[#64748B]">{item.time}</p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                                <span className={`text-xs font-semibold ${item.completed ? 'text-emerald-600' : 'text-[#64748B]'}`}>
                                    {item.status}
                                </span>
                                <button
                                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                                        item.completed
                                            ? 'bg-[#10B981] text-white'
                                            : 'border-2 border-[#CBD5E1] hover:border-[#1D63ED] text-transparent hover:text-[#1D63ED]'
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
