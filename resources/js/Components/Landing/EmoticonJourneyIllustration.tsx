import { motion } from 'framer-motion';
import { Sprout, BookOpen, Smile, Target } from 'lucide-react';

export default function EmoticonJourneyIllustration() {
    return (
        <div className="relative w-full max-w-lg mx-auto py-10 px-5 sm:px-8 select-none">
            <motion.div
                initial="hidden"
                animate="visible"
                className="relative"
            >
                {/* Main Center Card */}
                <motion.div
                    variants={{
                        hidden: { opacity: 0, scale: 0.96, y: 12 },
                        visible: {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                        },
                    }}
                    className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8 sm:p-11 shadow-xl shadow-stone-900/5 text-center flex flex-col items-center justify-center min-h-[320px] sm:min-h-[360px]"
                >
                    {/* Focal Graphic Illustration */}
                    <motion.div
                        variants={{
                            hidden: { scale: 0.7, opacity: 0 },
                            visible: {
                                scale: 1,
                                opacity: 1,
                                transition: { delay: 0.15, type: 'spring', stiffness: 260, damping: 20 },
                            },
                        }}
                        whileHover={{ scale: 1.06, rotate: [0, -3, 3, 0] }}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-amber-500/20 flex items-center justify-center mb-5 border border-amber-500/20 cursor-default text-amber-600 dark:text-amber-400"
                    >
                        <Sprout className="w-10 h-10 sm:w-12 sm:h-12 stroke-[1.8]" />
                    </motion.div>

                    {/* Main Title & Subtitle */}
                    <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
                        Mindstep Space
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-amber-600 dark:text-amber-400 mt-1">
                        Atur Rutinitas, Catat Harimu
                    </p>
                </motion.div>

                {/* Floating Card 1: Top Right */}
                <motion.div
                    variants={{
                        hidden: { opacity: 0, x: 16, y: -8 },
                        visible: {
                            opacity: 1,
                            x: 0,
                            y: 0,
                            transition: { delay: 0.25, duration: 0.45, ease: 'easeOut' },
                        },
                    }}
                    whileHover={{ y: -3, scale: 1.02 }}
                    className="absolute -top-4 sm:-top-5 -right-2 sm:-right-4 z-10 flex items-center gap-3 bg-white dark:bg-stone-850 border border-stone-200/90 dark:border-stone-700/80 rounded-2xl p-2.5 sm:p-3.5 shadow-lg shadow-stone-900/10 cursor-default"
                >
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300 flex-shrink-0">
                        <BookOpen className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div className="text-left pr-2">
                        <div className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 leading-tight">
                            Jurnal Refleksi
                        </div>
                        <div className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                            Ceritakan Harimu
                        </div>
                    </div>
                </motion.div>

                {/* Floating Card 2: Bottom Right (Clear from center text) */}
                <motion.div
                    variants={{
                        hidden: { opacity: 0, x: 16, y: 12 },
                        visible: {
                            opacity: 1,
                            x: 0,
                            y: 0,
                            transition: { delay: 0.38, duration: 0.45, ease: 'easeOut' },
                        },
                    }}
                    whileHover={{ y: -3, scale: 1.02 }}
                    className="absolute bottom-2 sm:bottom-4 -right-2 sm:-right-5 z-10 flex items-center gap-3 bg-white dark:bg-stone-850 border border-stone-200/90 dark:border-stone-700/80 rounded-2xl p-2.5 sm:p-3.5 shadow-lg shadow-stone-900/10 cursor-default"
                >
                    <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-700 dark:text-rose-300 flex-shrink-0">
                        <Smile className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div className="text-left pr-2">
                        <div className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 leading-tight">
                            Mood Hari Ini
                        </div>
                        <div className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                            Bagaimana Perasaanmu?
                        </div>
                    </div>
                </motion.div>

                {/* Floating Card 3: Bottom Left */}
                <motion.div
                    variants={{
                        hidden: { opacity: 0, x: -16, y: 12 },
                        visible: {
                            opacity: 1,
                            x: 0,
                            y: 0,
                            transition: { delay: 0.5, duration: 0.45, ease: 'easeOut' },
                        },
                    }}
                    whileHover={{ y: -3, scale: 1.02 }}
                    className="absolute -bottom-4 sm:-bottom-5 -left-2 sm:-left-4 z-10 flex items-center gap-3 bg-white dark:bg-stone-850 border border-stone-200/90 dark:border-stone-700/80 rounded-2xl p-2.5 sm:p-3.5 shadow-lg shadow-stone-900/10 cursor-default"
                >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-700 dark:text-amber-300 flex-shrink-0">
                        <Target className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div className="text-left pr-2">
                        <div className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 leading-tight">
                            Kebiasaan Harian
                        </div>
                        <div className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                            Sedikit Demi Sedikit
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
