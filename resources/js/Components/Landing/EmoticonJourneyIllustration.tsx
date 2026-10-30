export default function EmoticonJourneyIllustration() {
    return (
        <div className="w-full max-w-md mx-auto">
            <div className="rounded-3xl bg-gradient-to-b from-stone-50 to-amber-50/40 dark:from-stone-900 dark:to-stone-900/60 border border-stone-200/90 dark:border-stone-800 p-6 sm:p-8 shadow-xl shadow-stone-900/5">
                {/* Visual Header */}
                <div className="text-center pb-6 border-b border-stone-200/60 dark:border-stone-800">
                    <div className="text-4xl sm:text-5xl mb-3 tracking-widest select-none">
                        🌱 ☀️ 🌙
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                        Siklus Hidup Berkesadaran
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xs mx-auto leading-relaxed">
                        Tiga langkah alami setiap hari: membangun kebiasaan, merawat emosi, dan mengendapkan pikiran.
                    </p>
                </div>

                {/* 3 Visual Pillars */}
                <div className="py-6 space-y-4">
                    {/* Pillar 1: Habit */}
                    <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200/70 dark:border-stone-800 shadow-sm">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-2xl flex-shrink-0 select-none">
                            💧
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                                    Kebiasaan Fleksibel
                                </h4>
                                <span className="text-sm select-none">🏃 🧘 📚</span>
                            </div>
                            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                                Konsistensi tanpa rasa bersalah saat butuh istirahat.
                            </p>
                        </div>
                    </div>

                    {/* Pillar 2: Mood */}
                    <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200/70 dark:border-stone-800 shadow-sm">
                        <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-2xl flex-shrink-0 select-none">
                            🙂
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                                    Kesadaran Suasana Hati
                                </h4>
                                <span className="text-sm select-none">😔 😐 🙂 😊</span>
                            </div>
                            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                                Kenali spektrum perasaan harian dengan jujur dan tenang.
                            </p>
                        </div>
                    </div>

                    {/* Pillar 3: Journal */}
                    <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200/70 dark:border-stone-800 shadow-sm">
                        <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-2xl flex-shrink-0 select-none">
                            ✍️
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                                    Refleksi & Pemantik AI
                                </h4>
                                <span className="text-sm select-none">📖 💡 🌿</span>
                            </div>
                            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                                Endapkan pikiran malam hari dengan bantuan pertanyaan terarah.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Harmonious Footer Note */}
                <div className="pt-4 border-t border-stone-200/60 dark:border-stone-800 text-center">
                    <p className="text-xs font-medium text-stone-600 dark:text-stone-400">
                        Harmoni pikiran dan tindakan dalam satu ruang pribadi 🤍
                    </p>
                </div>
            </div>
        </div>
    );
}
