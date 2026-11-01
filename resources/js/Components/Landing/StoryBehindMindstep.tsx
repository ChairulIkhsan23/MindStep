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
                        Menyatukan rutinitas, suasana hati, dan cerita harian dalam satu tempat.
                    </h2>
                    <p className="mt-5 text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed">
                        Setiap hari membawa ritme yang berbeda. Ada kebiasaan yang ingin dijaga, suasana hati yang naik turun, dan berbagai momen yang ingin diingat. Namun sering kali, hal-hal tersebut tercecer di berbagai catatan terpisah atau terlewat begitu saja tanpa sempat dirangkum.
                    </p>
                </motion.div>

                {/* Editorial Narrative Split */}
                <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
                    {/* Point 01: Latar Belakang */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                        className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8"
                    >
                        <span className="text-xs font-mono italic text-stone-400 dark:text-stone-500">
                            [01] Latar Belakang
                        </span>
                        <h3 className="mt-2 text-lg font-bold text-stone-900 dark:text-stone-100">
                            Keseharian yang tersebar di banyak tempat
                        </h3>
                        <p className="mt-3 text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
                            Mengelola aktivitas harian biasanya membutuhkan beberapa tempat berbeda: satu untuk memeriksa kebiasaan, satu untuk mencatat suasana hati, dan tempat lain untuk menuliskan kejadian penting. Ketika pencatatan terpecah-pecah, kita kehilangan gambaran utuh tentang apa yang sebenarnya terjadi dalam keseharian kita.
                        </p>
                    </motion.div>

                    {/* Point 02: Pendekatan */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                        className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8"
                    >
                        <span className="text-xs font-mono italic text-amber-600 dark:text-amber-400">
                            [02] Pendekatan
                        </span>
                        <h3 className="mt-2 text-lg font-bold text-stone-900 dark:text-stone-100">
                            Satu ruang terpadu yang fleksibel
                        </h3>
                        <p className="mt-3 text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
                            Mindstep dirancang untuk menyatukan ketiga hal tersebut dalam alur yang sederhana dan praktis. Kamu memiliki kebebasan untuk mengatur rutinitas, mendokumentasikan apa yang dirasakan, dan melihat kembali progres harian sesuai kebutuhan dan ritme pribadimu.
                        </p>
                    </motion.div>
                </div>

                {/* Closing Quote */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
                    className="mt-8 sm:mt-10 p-6 sm:p-8 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-stone-700 dark:text-stone-300"
                >
                    <p className="text-sm sm:text-base leading-relaxed italic text-stone-800 dark:text-stone-200">
                        &ldquo;Mindstep hadir untuk memberikan satu ruang terpadu yang tenang, agar kamu dapat menata aktivitas hari ini dan mengingat kembali pengalaman hidupmu dengan lebih jernih.&rdquo;
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
