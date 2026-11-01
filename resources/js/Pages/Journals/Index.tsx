import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Filter, Plus, Search } from 'lucide-react';

export default function JournalsIndex() {
    return (
        <AuthenticatedLayout>
            <Head title="Journaling & Refleksi - MindStep" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200/90 dark:border-stone-800">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                                Ruang Refleksi
                            </span>
                        </div>
                        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
                            Journaling & Refleksi
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                            Dokumentasikan perjalanan pikiran, rasa syukur, dan evaluasi kesadaran harimu.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-850 shadow-sm">
                            <Filter className="w-4 h-4 text-stone-400" />
                            <span>Kategori</span>
                        </button>
                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm shadow-amber-600/20">
                            <Plus className="w-4 h-4" />
                            <span>Tulis Jurnal Baru</span>
                        </button>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-semibold overflow-x-auto">
                        <button className="px-3 py-1.5 rounded-full bg-amber-600 text-white shadow-sm shrink-0">
                            Semua Jurnal (14)
                        </button>
                        <button className="px-3 py-1.5 rounded-full bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-850 shrink-0">
                            Refleksi Pagi (6)
                        </button>
                        <button className="px-3 py-1.5 rounded-full bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-850 shrink-0">
                            Evaluasi Malam (5)
                        </button>
                        <button className="px-3 py-1.5 rounded-full bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-850 shrink-0">
                            Catatan Bebas (3)
                        </button>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Cari kata kunci atau tag..."
                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-stone-900 rounded-xl border border-stone-200/90 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-amber-600"
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
                            className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-5 shadow-sm hover:border-amber-300 dark:hover:border-amber-800/80 transition-all flex flex-col justify-between space-y-3"
                        >
                            <div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-[11px]">
                                        {entry.mood}
                                    </span>
                                    <span className="text-stone-500 dark:text-stone-400 text-[11px]">{entry.date}</span>
                                </div>

                                <h3 className="mt-2.5 text-base font-bold text-stone-900 dark:text-stone-100 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer">
                                    {entry.title}
                                </h3>

                                <p className="mt-1.5 text-xs text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3">
                                    {entry.excerpt}
                                </p>
                            </div>

                            <div className="pt-3 border-t border-stone-200/90 dark:border-stone-800 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    {entry.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[10px] font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <button className="text-amber-600 dark:text-amber-400 font-bold text-xs hover:underline flex items-center gap-1 shrink-0">
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
