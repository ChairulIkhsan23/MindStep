import { motion } from 'framer-motion';

export default function EmoticonJourneyIllustration() {
    return (
        <div className="relative w-full max-w-md mx-auto py-6 px-3 sm:px-4 select-none">
            <motion.div
                initial="hidden"
                animate="visible"
                className="relative"
            >
                {/* Main Center Card */}
                <motion.div
                    variants={{
                        hidden: { opacity: 0, scale: 0.96, y: 10 },
                        visible: {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                        },
                    }}
                    className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-9 shadow-xl shadow-stone-900/5 text-center flex flex-col items-center justify-center min-h-[250px] sm:min-h-[280px]"
                >
                    {/* Focal Graphic Illustration */}
                    <motion.div
                        variants={{
                            hidden: { scale: 0.7, opacity: 0 },
                            visible: {
                                scale: 1,
                                opacity: 1,
                                transition: { delay: 0.12, type: 'spring', stiffness: 260, damping: 20 },
                            },
                        }}
                        whileHover={{ scale: 1.06, rotate: [0, -3, 3, 0] }}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-amber-500/20 flex items-center justify-center mb-4 border border-amber-500/20 cursor-default"
                    >
                        <span className="text-3xl sm:text-4xl">🌱</span>
                    </motion.div>

                    {/* Main Title & Subtitle */}
                    <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
                        Mindstep Space
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-amber-600 dark:text-amber-400 mt-0.5">
                        Ruang Bertumbuh Sadar
                    </p>
                </motion.div>

                {/* Floating Card 1: Top Right */}
                <motion.div
                    variants={{
                        hidden: { opacity: 0, x: 12, y: -6 },
                        visible: {
                            opacity: 1,
                            x: 0,
                            y: 0,
                            transition: { delay: 0.22, duration: 0.4, ease: 'easeOut' },
                        },
                    }}
                    whileHover={{ y: -3, scale: 1.02 }}
                    className="absolute -top-4 sm:-top-5 -right-2 sm:-right-4 z-10 flex items-center gap-2.5 bg-white dark:bg-stone-850 border border-stone-200/90 dark:border-stone-700/80 rounded-2xl p-2 sm:p-3 shadow-lg shadow-stone-900/10 cursor-default"
                >
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-base sm:text-lg text-emerald-700 dark:text-emerald-300 flex-shrink-0">
                        📖
                    </div>
                    <div className="text-left pr-1.5">
                        <div className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 leading-tight">
                            Jurnal Refleksi
                        </div>
                        <div className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                            Setiap Malam
                        </div>
                    </div>
                </motion.div>

                {/* Floating Card 2: Bottom Right */}
                <motion.div
                    variants={{
                        hidden: { opacity: 0, x: 12, y: 8 },
                        visible: {
                            opacity: 1,
                            x: 0,
                            y: 0,
                            transition: { delay: 0.34, duration: 0.4, ease: 'easeOut' },
                        },
                    }}
                    whileHover={{ y: -3, scale: 1.02 }}
                    className="absolute top-1/2 translate-y-4 sm:translate-y-6 -right-2 sm:-right-5 z-10 flex items-center gap-2.5 bg-white dark:bg-stone-850 border border-stone-200/90 dark:border-stone-700/80 rounded-2xl p-2 sm:p-3 shadow-lg shadow-stone-900/10 cursor-default"
                >
                    <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-base sm:text-lg text-rose-700 dark:text-rose-300 flex-shrink-0">
                        🙂
                    </div>
                    <div className="text-left pr-1.5">
                        <div className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 leading-tight">
                            Suasana Hati
                        </div>
                        <div className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                            Kondisi Tenang
                        </div>
                    </div>
                </motion.div>

                {/* Floating Card 3: Bottom Left */}
                <motion.div
                    variants={{
                        hidden: { opacity: 0, x: -12, y: 8 },
                        visible: {
                            opacity: 1,
                            x: 0,
                            y: 0,
                            transition: { delay: 0.44, duration: 0.4, ease: 'easeOut' },
                        },
                    }}
                    whileHover={{ y: -3, scale: 1.02 }}
                    className="absolute -bottom-4 sm:-bottom-5 -left-2 sm:-left-4 z-10 flex items-center gap-2.5 bg-white dark:bg-stone-850 border border-stone-200/90 dark:border-stone-700/80 rounded-2xl p-2 sm:p-3 shadow-lg shadow-stone-900/10 cursor-default"
                >
                    <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-base sm:text-lg text-amber-700 dark:text-amber-300 flex-shrink-0">
                        🎯
                    </div>
                    <div className="text-left pr-1.5">
                        <div className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 leading-tight">
                            Target Habit
                        </div>
                        <div className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                            Ritme Konsisten
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
