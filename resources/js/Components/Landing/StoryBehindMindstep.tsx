import { motion } from 'framer-motion';

export default function StoryBehindMindstep() {
    return (
        <section id="story" className="relative py-20 sm:py-28 bg-stone-50/70 dark:bg-stone-900/30 border-y border-stone-200/70 dark:border-stone-800/80">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
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
                        Setiap hari, ada saja hal yang ingin kita lakukan, rasakan, atau ceritakan. Tapi sering kali catatan kebiasaan ada di satu aplikasi, catatan perasaan ada di tempat lain, dan cerita harian tercecer begitu saja tanpa sempat dirangkum.
                    </p>
                </motion.div>

                {/* Editorial Narrative Split */}
                <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
                    {/* Point 01: Latar Belakang */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                        className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8"
                    >
                        <span className="text-xs font-mono text-stone-400 dark:text-stone-500">
                            <span className="not-italic font-normal">[01]</span>{' '}
                            <span className="italic">Latar Belakang</span>
                        </span>
                        <h3 className="mt-2 text-lg font-bold text-stone-900 dark:text-stone-100">
                            Keseharian yang tersebar di banyak tempat
                        </h3>
                        <p className="mt-3 text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
                            Mencatat keseharian terasa merepotkan kalau harus membuka banyak tempat berbeda. Satu untuk melihat kebiasaan, satu untuk mencatat suasana hati, dan satu lagi untuk menulis jurnal. Akhirnya, banyak catatan yang terbengkalai.
                        </p>
                    </motion.div>

                    {/* Point 02: Pendekatan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                        className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8"
                    >
                        <span className="text-xs font-mono text-amber-600 dark:text-amber-400">
                            <span className="not-italic font-normal">[02]</span>{' '}
                            <span className="italic">Pendekatan</span>
                        </span>
                        <h3 className="mt-2 text-lg font-bold text-stone-900 dark:text-stone-100">
                            Satu ruang yang sederhana dan fleksibel
                        </h3>
                        <p className="mt-3 text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
                            Mindstep menggabungkan semuanya ke dalam satu tempat yang rapi dan mudah dipakai. Kamu bebas mengatur rutinitas, mencatat suasana hati, dan menyimpan ceritamu sesuai kebutuhan dan ritmemu sendiri.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
