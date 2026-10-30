export default function ProblemSolutionGrid() {
    const comparisons = [
        {
            problemTitle: 'Patah Streak yang Bikin Frustrasi',
            problemDesc: 'Aplikasi habit biasa menganggap Anda gagal total saat melewatkan satu hari karena sakit atau istirahat, membuat motivasi runtuh.',
            solutionTitle: 'Flexible Streaks & Rest Days',
            solutionDesc: 'Mindstep menghargai batas manusiawi. Tentukan target mingguan fleksibel atau hari istirahat tanpa merusak riwayat konsistensi Anda.',
            icon: (
                <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
        },
        {
            problemTitle: 'Bingung Menulis di Halaman Kosong',
            problemDesc: 'Buku jurnal konvensional menyajikan kertas putih tanpa panduan. Akhirnya terbengkalai karena terasa berat dan menyita waktu.',
            solutionTitle: 'Dynamic Guided Templates',
            solutionDesc: 'Pilih panduan reflektif terstruktur seperti Gratitude, Stoic Reflection, CBT Reframe, atau tulis bebas secara santai.',
            icon: (
                <svg className="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
        },
        {
            problemTitle: 'Khawatir Privasi Pikiran Intim Bocor',
            problemDesc: 'Banyak platform memanfaatkan data curahan hati pengguna untuk melatih model kecerdasan buatan pihak ketiga tanpa izin transparan.',
            solutionTitle: 'Safe AI & Kedaulatan Penuh',
            solutionDesc: 'Fitur AI non-aktif sampai Anda setujui. Teks pribadi disanitasi otomatis, dan seluruh data bisa Anda unduh atau hapus permanen kapan saja.',
            icon: (
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
        },
    ];

    return (
        <section className="py-20 bg-stone-50/60 dark:bg-stone-900/40 border-y border-stone-200/80 dark:border-stone-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
                        Mengapa Mindstep Berbeda
                    </h2>
                    <h3 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 sm:text-4xl">
                        Dibuat untuk manusia nyata, bukan robot tanpa lelah.
                    </h3>
                    <p className="mt-4 text-base text-stone-600 dark:text-stone-400">
                        Kami merancang Mindstep dengan menghilangkan rasa bersalah saat gagal, serta menjaga ruang aman untuk perkembangan diri yang jujur.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {comparisons.map((c, i) => (
                        <div
                            key={i}
                            className="flex flex-col rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-5">
                                {c.icon}
                            </div>

                            {/* Problem */}
                            <div className="mb-4 pb-4 border-b border-stone-100 dark:border-stone-800">
                                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-xs uppercase tracking-wider mb-1">
                                    <span>✕ Masalah Umum</span>
                                </div>
                                <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200 mb-1">
                                    {c.problemTitle}
                                </h4>
                                <p className="text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                                    {c.problemDesc}
                                </p>
                            </div>

                            {/* Solution */}
                            <div className="mt-auto">
                                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-1">
                                    <span>✓ Solusi Mindstep</span>
                                </div>
                                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1">
                                    {c.solutionTitle}
                                </h4>
                                <p className="text-xs leading-relaxed text-stone-600 dark:text-stone-300">
                                    {c.solutionDesc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
