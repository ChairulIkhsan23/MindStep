export default function FeaturesBentoGrid() {
    return (
        <section id="features" className="py-24 bg-white dark:bg-stone-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
                        Pilar Arsitektur Produk
                    </h2>
                    <h3 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 sm:text-4xl">
                        Empat modul terpadu dalam satu alur kerja harmonis.
                    </h3>
                    <p className="mt-4 text-base text-stone-600 dark:text-stone-400">
                        Tidak ada lagi aplikasi terpisah antara catatan kebiasaan dan buku jurnal refleksi harian Anda.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Habit Engine (Col-span 2) */}
                    <div className="md:col-span-2 rounded-3xl bg-gradient-to-br from-stone-50 to-amber-50/40 dark:from-stone-900 dark:to-stone-900/60 border border-stone-200 dark:border-stone-800 p-8 flex flex-col justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-4">
                                Modul 01 • Habit Engine
                            </div>
                            <h4 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-3">
                                Lacak Berbagai Jenis Target Sesuai Kebutuhan Nyata
                            </h4>
                            <p className="text-sm text-stone-600 dark:text-stone-400 max-w-xl leading-relaxed">
                                Mendukung tipe target <strong>Boolean (ya/tidak)</strong>, <strong>Kuantitatif (misal: 8 gelas air)</strong>, dan <strong>Durasi (misal: 30 menit meditasi)</strong>. Lengkap dengan riwayat log backdating dan kalkulasi streak akurat.
                            </p>
                        </div>

                        <div className="mt-8 grid grid-cols-3 gap-3">
                            <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/60 dark:border-stone-700">
                                <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">Boolean</div>
                                <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1">1-Tap Selesai</div>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/60 dark:border-stone-700">
                                <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">Kuantitatif</div>
                                <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1">Target Angka</div>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/60 dark:border-stone-700">
                                <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">Durasi</div>
                                <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1">Waktu Menit</div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Mood & Emotion Tracking (Col-span 1) */}
                    <div className="rounded-3xl bg-gradient-to-br from-stone-50 to-rose-50/40 dark:from-stone-900 dark:to-stone-900/60 border border-stone-200 dark:border-stone-800 p-8 flex flex-col justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-xs font-semibold mb-4">
                                Modul 02 • Mood Check-in
                            </div>
                            <h4 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                                Skala Emosi Tanpa Bias
                            </h4>
                            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                                Catat suasana hati dalam skala 1–5 lengkap dengan pilihan emotion tags. Terhubung opsional ke jurnal untuk memahami pemicu emosi.
                            </p>
                        </div>

                        <div className="mt-6 flex items-center justify-around py-3 px-2 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/60 dark:border-stone-700 text-lg">
                            <span>😔</span>
                            <span>😕</span>
                            <span>😐</span>
                            <span>🙂</span>
                            <span className="scale-125">😊</span>
                        </div>
                    </div>

                    {/* Card 3: Dynamic Journaling (Col-span 1) */}
                    <div className="rounded-3xl bg-gradient-to-br from-stone-50 to-indigo-50/40 dark:from-stone-900 dark:to-stone-900/60 border border-stone-200 dark:border-stone-800 p-8 flex flex-col justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 text-xs font-semibold mb-4">
                                Modul 03 • Jurnal Dinamis
                            </div>
                            <h4 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                                Template Refleksi Terarah
                            </h4>
                            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                                Dikelola admin sistem dengan metode teruji: Gratitude Journal, Stoic Evening, CBT Cognitive Reframe, dan Weekly Review.
                            </p>
                        </div>

                        <div className="mt-6 space-y-2">
                            <div className="text-xs p-2.5 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200/60 dark:border-stone-700 font-medium text-stone-800 dark:text-stone-200">
                                Stoic: Apa yang di luar kendaliku?
                            </div>
                            <div className="text-xs p-2.5 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200/60 dark:border-stone-700 font-medium text-stone-800 dark:text-stone-200">
                                Gratitude: 3 Hal patut disyukuri
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Cross-Correlation Analytics (Col-span 2) */}
                    <div className="md:col-span-2 rounded-3xl bg-gradient-to-br from-stone-50 to-emerald-50/40 dark:from-stone-900 dark:to-stone-900/60 border border-stone-200 dark:border-stone-800 p-8 flex flex-col justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-4">
                                Modul 04 • Korelasi Silang Analitik
                            </div>
                            <h4 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-3">
                                Temukan Hubungan Riil Antara Kebiasaan dan Suasana Hati
                            </h4>
                            <p className="text-sm text-stone-600 dark:text-stone-400 max-w-xl leading-relaxed">
                                Bukan sekadar grafik biasa. Mindstep membandingkan rata-rata skor mood pada hari saat kebiasaan Anda tuntas 100% vs saat ada kebiasaan yang terlewatkan.
                            </p>
                        </div>

                        <div className="mt-8 p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/60 dark:border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <div className="text-xs font-medium text-stone-500 dark:text-stone-400">
                                    Rata-rata Mood Saat Habit 100% Tuntas:
                                </div>
                                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mt-0.5">
                                    <span>4.6 / 5.0</span>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">Korelasi Positif</span>
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-medium text-stone-500 dark:text-stone-400">
                                    Rata-rata Mood Saat Habit Terlewat:
                                </div>
                                <div className="text-xl font-bold text-stone-700 dark:text-stone-300 mt-0.5">
                                    3.1 / 5.0
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
