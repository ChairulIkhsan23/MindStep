import { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { PageProps } from '@/types';
import LandingNavbar from '@/Components/Landing/LandingNavbar';
import MarkerHighlight from '@/Components/Landing/MarkerHighlight';
import EmoticonJourneyIllustration from '@/Components/Landing/EmoticonJourneyIllustration';
import StoryBehindMindstep from '@/Components/Landing/StoryBehindMindstep';
import FeaturesBentoGrid from '@/Components/Landing/FeaturesBentoGrid';
import LandingFooter from '@/Components/Landing/LandingFooter';

export default function Welcome({
    auth,
}: PageProps<{ laravelVersion?: string; phpVersion?: string }>) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        let rafId: number;
        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        const handleAnchorClick = (e: MouseEvent) => {
            const target = (e.target as HTMLElement).closest('a[href^="#"]');
            if (target) {
                const href = target.getAttribute('href');
                if (href && href.startsWith('#') && href.length > 1) {
                    const el = document.querySelector(href);
                    if (el) {
                        e.preventDefault();
                        lenis.scrollTo(el as HTMLElement, { offset: -64 });
                    }
                }
            }
        };

        document.addEventListener('click', handleAnchorClick);

        return () => {
            document.removeEventListener('click', handleAnchorClick);
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 antialiased selection:bg-amber-500 selection:text-white transition-colors duration-200">
            <Head title="MindStep - Habit Tracker & Journaling Platform" />

            {/* 1. Sticky Navigation */}
            <LandingNavbar user={auth.user} />

            {/* 2. Hero Section (Full Viewport Height) */}
            <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 lg:py-0 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center w-full">
                        {/* Hero Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="lg:col-span-6 text-center lg:text-left"
                        >
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 leading-[1.16]">
                                Bangun rutinitas, pantau mood, dan dokumentasikan{' '}
                                <MarkerHighlight
                                    highlight="aktivitas harianmu."
                                    markerColor="bg-gradient-to-r from-amber-400/40 via-rose-400/35 to-amber-400/40 dark:from-amber-500/30 dark:via-rose-500/25 dark:to-amber-500/30"
                                    className="text-stone-900 dark:text-stone-100"
                                />
                            </h1>

                            <p className="mt-6 text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                Kelola kebiasaan harian, catat perasaanmu, dan simpan ceritamu dalam satu tempat. Mindstep membantumu mengatur rutinitas secara fleksibel, tanpa ribet dan tanpa tekanan.
                            </p>

                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-bold text-white bg-amber-600 hover:bg-amber-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        Buka Dashboard Kamu
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('register')}
                                            className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-bold text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white transition-all active:scale-95 text-center"
                                        >
                                            Mulai Sekarang, Gratis
                                        </Link>
                                        <a
                                            href="#features"
                                            className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-base font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-center"
                                        >
                                            Lihat Fitur
                                        </a>
                                    </>
                                )}
                            </div>
                        </motion.div>

                        {/* Emoticon Journey Illustration */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
                            className="lg:col-span-6 flex justify-center"
                        >
                            <EmoticonJourneyIllustration />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 3. The Story Behind Mindstep */}
            <StoryBehindMindstep />

            {/* 4. Core Features Bento Grid */}
            <FeaturesBentoGrid />

            {/* 5. Final Conversion Banner */}
            <section className="py-16 sm:py-24 bg-white dark:bg-stone-950">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="relative rounded-3xl bg-stone-900 text-white px-6 py-12 sm:px-12 sm:py-16 text-center overflow-hidden border border-stone-800 shadow-xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/15 via-rose-600/10 to-amber-600/15 -z-10" />
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug">
                            Mulai rapikan rutinitas dan catatan harianmu.
                        </h2>
                        <p className="mt-4 text-sm sm:text-base text-stone-300 max-w-xl mx-auto leading-relaxed">
                            Buat kebiasaan baru, catat apa yang kamu rasakan, dan simpan ceritamu hari ini. Kamu bisa mulai kapan saja dengan ritmemu sendiri.
                        </p>
                        <div className="mt-8 flex justify-center">
                            <Link
                                href={auth.user ? route('dashboard') : route('register')}
                                className="inline-flex items-center gap-2 px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl text-base font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 transition-all active:scale-95"
                            >
                                {auth.user ? 'Buka Dashboard Kamu' : 'Daftar Akun Gratis'}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <LandingFooter />
        </div>
    );
}
