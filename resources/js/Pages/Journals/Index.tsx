import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Bookmark,
    BookOpen,
    Calendar,
    Filter,
    Lock,
    PenLine,
    Plus,
    Search,
    Sparkles,
    Tag,
} from 'lucide-react';

export default function JournalsIndex() {
    return (
        <AuthenticatedLayout>
            <Head title="Journaling & Refleksi - MindStep" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-[#EFF6FF] text-[#1D63ED] border border-[#DBEAFE]">
                                Ruang Refleksi
                            </span>
                        </div>
                        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0F172A]">
                            Journaling & Refleksi
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
                            Dokumentasikan perjalanan pikiran, rasa syukur, dan evaluasi kesadaran harimu.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#0F172A] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] shadow-sm">
                            <Filter className="w-4 h-4 text-[#64748B]" />
                            <span>Kategori</span>
                        </button>
                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#1D63ED] hover:bg-[#1E40AF] shadow-sm shadow-[#1D63ED]/20">
                            <Plus className="w-4 h-4" />
                            <span>Tulis Jurnal Baru</span>
                        </button>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-semibold overflow-x-auto">
                        <button className="px-3 py-1.5 rounded-full bg-[#1D63ED] text-white shadow-sm shrink-0">
                            Semua Jurnal (14)
                        </button>
                        <button className="px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] shrink-0">
                            Refleksi Pagi (6)
                        </button>
                        <button className="px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] shrink-0">
                            Evaluasi Malam (5)
                        </button>
                        <button className="px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] shrink-0">
                            Catatan Bebas (3)
                        </button>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Cari kata kunci atau tag..."
                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:border-[#1D63ED]"
                        />
                    </div>
                </div>

                {/* Journal Entries Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {[
                        {
                            title: 'Refleksi Progres Proyek dan Ketenangan Batin',
                            date: 'Kamis, 24 Okt 2024 • 08:30 WIB',
                            mood: '😊 Baik (4/5)',
                            excerpt:
                                'Hari ini berhasil menuntaskan modul utama tanpa terdistraksi media sosial. Menyadari bahwa memulai adalah bagian tersulit, namun setelah 5 menit pertama pernapasan sadar, fokus mengalir alami...',
                            tags: ['#Bersyukur', '#Fokus', '#PengembanganDiri'],
                        },
                        {
                            title: 'Evaluasi Pekan: Menyeimbangkan Pekerjaan dan Istirahat',
                            date: 'Rabu, 23 Okt 2024 • 21:15 WIB',
                            mood: '😐 Netral (3/5)',
                            excerpt:
                                'Merasa sedikit kelelahan di sore hari. Perlu memperbaiki jadwal tidur malam dan membatasi konsumsi kafein setelah jam 2 siang agar kualitas pemulihan energi tetap optimal...',
                            tags: ['#Evaluasi', '#Kesehatan', '#Istirahat'],
                        },
                        {
                            title: 'Momen Kecil yang Menghadirkan Kedamaian',
                            date: 'Selasa, 22 Okt 2024 • 07:10 WIB',
                            mood: '✨ Hebat (5/5)',
                            excerpt:
                                'Menikmati seduhan teh hangat sambil mengamati pepohonan di halaman rumah. Kadang hal paling berharga bukanlah pencapaian spektakuler, melainkan kemampuan untuk hadir sepenuhnya saat ini...',
                            tags: ['#Mindfulness', '#Syukur', '#PagiTenang'],
                        },
                        {
                            title: 'Pelajaran Mengatasi Rasa Cemas Menjelang Presentasi',
                            date: 'Senin, 21 Okt 2024 • 19:45 WIB',
                            mood: '😊 Baik (4/5)',
                            excerpt:
                                'Awalnya merasa tegang, tetapi teknik pernapasan 4-7-8 yang dilatih rutin selama 2 pekan terakhir sangat membantu menenangkan detak jantung dan menjernihkan artikulasi...',
                            tags: ['#RegulasiDiri', '#Pertumbuhan', '#Keberanian'],
                        },
                    ].map((entry, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm hover:border-[#DBEAFE] hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                        >
                            <div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                                        {entry.mood}
                                    </span>
                                    <span className="text-[#64748B] text-[11px]">{entry.date}</span>
                                </div>

                                <h3 className="mt-2.5 text-base font-bold text-[#0F172A] hover:text-[#1D63ED] cursor-pointer">
                                    {entry.title}
                                </h3>

                                <p className="mt-1.5 text-xs text-[#475569] leading-relaxed line-clamp-3">
                                    {entry.excerpt}
                                </p>
                            </div>

                            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    {entry.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] text-[10px] font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <button className="text-[#1D63ED] font-bold text-xs hover:underline flex items-center gap-1 shrink-0">
                                    <span>Baca</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
