import { motion } from 'framer-motion';

export default function FeaturesBentoGrid() {
    return (
        <section id="features" className="py-20 sm:py-28 bg-white dark:bg-stone-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="text-center max-w-3xl mx-auto mb-14 sm:mb-16"
                >
                    <span className="text-xs font-semibold tracking-wider uppercase text-amber-700 dark:text-amber-400">
                        Fitur Utama
                    </span>
                    <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 leading-snug">
                        Semua fitur yang kamu butuhkan untuk rutinitas harian.
                    </h2>
                    <p className="mt-4 text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed">
                        Atur kebiasaan, catat suasana hati, dan tulis jurnal dengan mudah dalam satu tempat.
                    </p>
                </motion.div>

                {/* Grid Modules */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Module 01: Habit Tracker (Col-span 2) */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                        className="md:col-span-2 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-6 sm:p-8 flex flex-col justify-between"
                    >
                        <div>
                            <span className="text-xs font-mono text-amber-700 dark:text-amber-400 font-semibold tracking-wide">
                                01 • Habit Tracker
                            </span>
                            <h3 className="mt-2 text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                                Atur dan pantau kebiasaan harian dengan mudah.
                            </h3>
                            <p className="mt-3 text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed">
                                Buat kebiasaan baru dengan target centang, hitungan jumlah, atau durasi waktu. Cek jadwal dan lihat riwayat aktivitas harianmu kapan saja dengan mudah.
                            </p>
                        </div>

                        {/* Visual Preview */}
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-3.5 rounded-xl bg-white dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800">
                                <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">Penyelesaian</div>
                                <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1">1-Tap Selesai</div>
                            </div>
                            <div className="p-3.5 rounded-xl bg-white dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800">
                                <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">Target Jumlah</div>
                                <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1">Misal: 8 Gelas Air</div>
                            </div>
                            <div className="p-3.5 rounded-xl bg-white dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800">
                                <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">Target Durasi</div>
                                <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1">Misal: 30 Menit Baca</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Module 02: Mood Tracker (Col-span 1) */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
                        className="rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-6 sm:p-8 flex flex-col justify-between"
                    >
                        <div>
                            <span className="text-xs font-mono text-rose-600 dark:text-rose-400 font-semibold tracking-wide">
                                02 • Mood Tracker
                            </span>
                            <h3 className="mt-2 text-xl font-bold text-stone-900 dark:text-stone-100">
                                Catat dan amati perubahan suasana hatimu.
                            </h3>
                            <p className="mt-3 text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                                Pilih skala suasana hati dan tentukan emosi yang paling mewakili harimu. Hubungkan catatan ini dengan jurnal untuk melihat kembali momen yang kamu rasakan.
                            </p>
                        </div>

                        {/* Visual Preview */}
                        <div className="mt-6 flex items-center justify-between py-3.5 px-4 rounded-xl bg-white dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 text-lg">
                            <span title="Sangat Buruk">😔</span>
                            <span title="Kurang Baik">😕</span>
                            <span title="Biasa Saja">😐</span>
                            <span title="Baik">🙂</span>
                            <span title="Sangat Baik">😊</span>
                        </div>
                    </motion.div>

                    {/* Module 03: Daily Journal (Col-span 1) */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.45, delay: 0.15, ease: 'easeOut' }}
                        className="rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-6 sm:p-8 flex flex-col justify-between"
                    >
                        <div>
                            <span className="text-xs font-mono text-amber-700 dark:text-amber-400 font-semibold tracking-wide">
                                03 • Daily Journal
                            </span>
                            <h3 className="mt-2 text-xl font-bold text-stone-900 dark:text-stone-100">
                                Tulis catatan harian dengan panduan terarah.
                            </h3>
                            <p className="mt-3 text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                                Tulis apa saja yang ada di pikiranmu atau pilih template jurnal yang sudah disiapkan. Ada panduan seperti Gratitude, Stoic Reflection, CBT Reframe, dan Weekly Review.
                            </p>
                        </div>

                        {/* Visual Preview */}
                        <div className="mt-6 space-y-2">
                            <div className="text-xs p-3 rounded-xl bg-white dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 font-medium text-stone-800 dark:text-stone-200">
                                Gratitude: 3 Hal yang Disyukuri Hari Ini
                            </div>
                            <div className="text-xs p-3 rounded-xl bg-white dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 font-medium text-stone-800 dark:text-stone-200">
                                Stoic: Apa yang Berada dalam Kendaliku?
                            </div>
                        </div>
                    </motion.div>

                    {/* Module 04: Mood & Habit Insights (Col-span 2) */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.45, delay: 0.2, ease: 'easeOut' }}
                        className="md:col-span-2 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 p-6 sm:p-8 flex flex-col justify-between"
                    >
                        <div>
                            <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold tracking-wide">
                                04 • Mood & Habit Insights
                            </span>
                            <h3 className="mt-2 text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                                Pahami pola aktivitas dan suasana hatimu.
                            </h3>
                            <p className="mt-3 text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed">
                                Lihat ringkasan kebiasaan dan bagaimana suasana hatimu bergerak seiring rutinitas harian. Kenali polamu sendiri dengan santai tanpa harus merasa terbebani.
                            </p>
                        </div>

                        {/* Visual Preview */}
                        <div className="mt-8 p-4 rounded-xl bg-white dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <div className="text-xs font-medium text-stone-500 dark:text-stone-400">
                                    Rata-rata mood saat kebiasaan selesai:
                                </div>
                                <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 mt-0.5">
                                    <span>4.5 / 5.0</span>
                                    <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-medium">
                                        Pola Positif
                                    </span>
                                </div>
                            </div>
                            <div className="w-full sm:w-auto sm:border-l sm:border-stone-200 sm:dark:border-stone-800 sm:pl-6">
                                <div className="text-xs font-medium text-stone-500 dark:text-stone-400">
                                    Rata-rata mood saat kebiasaan terlewat:
                                </div>
                                <div className="text-xl font-bold text-stone-700 dark:text-stone-300 mt-0.5">
                                    3.2 / 5.0
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
