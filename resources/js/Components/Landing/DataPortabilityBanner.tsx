export default function DataPortabilityBanner() {
    return (
        <section id="privacy" className="py-20 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-3xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700/80 p-8 sm:p-12 shadow-sm">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-4">
                            🔒 Kedaulatan Data & GDPR Compliance
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
                            Data Anda Milik Anda Sepenuhnya. Tanpa Penguncian Vendor.
                        </h3>
                        <p className="mt-3 text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                            Kami percaya privasi catatan harian Anda adalah hak asasi. Mindstep menyediakan tombol ekspor data lengkap kapan saja dalam format universal.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-stone-100 dark:border-stone-800">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                                    Format JSON Tunggal
                                </h4>
                                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                                    Hierarki lengkap profil, habits, log harian, catatan mood, dan jurnal.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                                    Format CSV (ZIP Archive)
                                </h4>
                                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                                    Dilengkapi UTF-8 BOM agar rapi langsung dibuka di Excel atau Google Sheets.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                                    Hak Hapus Permanen
                                </h4>
                                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                                    Hapus akun kapan saja; seluruh data Anda di server kami dimusnahkan seketika.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
