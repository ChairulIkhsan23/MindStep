import { motion } from 'framer-motion';

export default function StoryBehindMindstep() {
    return (
        <section className="relative py-20 sm:py-28 bg-stone-50/70 dark:bg-stone-900/30 border-y border-stone-200/70 dark:border-stone-800/80">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="max-w-3xl"
                >
                    <span className="text-xs font-semibold tracking-wider uppercase text-amber-700 dark:text-amber-400">
                        Cerita di Balik Mindstep
                    </span>
                    <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 leading-snug">
                        Karena keseharian tidak selalu berjalan sesuai rencana.
                    </h2>
                    <p className="mt-5 text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed">
                        Menjaga kebiasaan, mengatur aktivitas, dan mencatat apa yang dirasakan terdengar sederhana di atas kertas. Namun dalam realitas sehari-hari, ada hari yang berjalan lancar, dan ada pula hari ketika banyak hal terasa melelahkan.
                    </p>
                </motion.div>

                {/* Editorial Narrative Split */}
                <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
                    {/* Perspective 1: Realita Tekanan Produktivitas */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                        className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8"
                    >
                        <span className="text-xs font-mono text-stone-400 dark:text-stone-500">
                            01 / Realitas
                        </span>
                        <h3 className="mt-2 text-lg font-bold text-stone-900 dark:text-stone-100">
                            Tekanan untuk selalu konsisten
                        </h3>
                        <p className="mt-3 text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
                            Banyak aplikasi produktivitas berfokus pada target tanpa henti dan hitungan streak yang kaku. Ketika satu hari terlewat karena kesibukan atau kondisi tubuh yang menurun, yang muncul sering kali bukan motivasi, melainkan rasa bersalah.
                        </p>
                    </motion.div>

                    {/* Perspective 2: Ruang yang Disediakan Mindstep */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                        className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8"
                    >
                        <span className="text-xs font-mono text-amber-600 dark:text-amber-400">
                            02 / Pendekatan
                        </span>
                        <h3 className="mt-2 text-lg font-bold text-stone-900 dark:text-stone-100">
                            Satu tempat tenang untuk kembali
                        </h3>
                        <p className="mt-3 text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
                            Mindstep dibuat dari kebutuhan sederhana: ruang yang tidak menuntut kesempurnaan. Tempat terpadu untuk merapikan rutinitas harian, mencatat suasana hati, dan menuliskan apa yang dialami tanpa keharusan memenuhi ekspektasi siapa pun.
                        </p>
                    </motion.div>
                </div>

                {/* Editorial Closing Note */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
                    className="mt-8 sm:mt-10 p-6 sm:p-8 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-stone-700 dark:text-stone-300"
                >
                    <p className="text-sm sm:text-base leading-relaxed italic text-stone-800 dark:text-stone-200">
                        &ldquo;Bukan tentang mengejar catatan tanpa cela setiap hari, melainkan memiliki wadah yang nyaman untuk memahami ritme diri sendiri dan melanjutkan langkah kapan pun kamu siap.&rdquo;
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
