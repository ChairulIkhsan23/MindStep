import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import LandingNavbar from '@/Components/Landing/LandingNavbar';
import HeroInteractiveWidget from '@/Components/Landing/HeroInteractiveWidget';
import ProblemSolutionGrid from '@/Components/Landing/ProblemSolutionGrid';
import FeaturesBentoGrid from '@/Components/Landing/FeaturesBentoGrid';
import AiAssistantSpotlight from '@/Components/Landing/AiAssistantSpotlight';
import DataPortabilityBanner from '@/Components/Landing/DataPortabilityBanner';
import LandingFooter from '@/Components/Landing/LandingFooter';

export default function Welcome({
    auth,
}: PageProps<{ laravelVersion?: string; phpVersion?: string }>) {
    return (
        <div className="min-h-screen bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 antialiased selection:bg-amber-500 selection:text-white transition-colors duration-200">
            <Head title="Mindstep - Habit Tracker & Journaling Platform" />

            {/* 1. Sticky Navigation */}
            <LandingNavbar user={auth.user} />

            {/* 2. Hero Section */}
            <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
                {/* Background decorative gradient */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-amber-400/10 via-rose-400/10 to-indigo-400/10 blur-3xl -z-10 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                        {/* Hero Text */}
                        <div className="lg:col-span-7 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-6 shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                                Mindstep • Habit Tracker & Journaling Platform
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 leading-[1.15]">
                                Bangun Kebiasaan Baik, Pahami Diri Lebih Dalam{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-rose-500 to-amber-700 dark:from-amber-400 dark:via-rose-400 dark:to-amber-300">
                                    Tanpa Rasa Bersalah.
                                </span>
                            </h1>

                            <p className="mt-6 text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                Platform terpadu pelacak kebiasaan fleksibel dan jurnal refleksi harian bertenaga AI etis. Selesaikan seluruh check-in harian dalam waktu kurang dari 10 detik.
                            </p>

                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-base font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-600/25 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        Buka Dashboard Saya
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('register')}
                                            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-base font-bold text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white shadow-lg transition-all active:scale-95 text-center"
                                        >
                                            Mulai Sekarang — Gratis
                                        </Link>
                                        <a
                                            href="#features"
                                            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-base font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-center"
                                        >
                                            Pelajari Fitur ↓
                                        </a>
                                    </>
                                )}
                            </div>

                            {/* Trust micro-badges */}
                            <div className="mt-10 pt-6 border-t border-stone-200/80 dark:border-stone-800 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-500 dark:text-stone-400">
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Tanpa Kartu Kredit</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>AI Reflektif Non-Klinis</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Ekspor Data Lengkap (GDPR)</span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Widget Demo */}
                        <div className="lg:col-span-5">
                            <HeroInteractiveWidget />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Problem vs Solution Grid */}
            <ProblemSolutionGrid />

            {/* 4. Core Features Bento Grid */}
            <FeaturesBentoGrid />

            {/* 5. Safe AI Spotlight */}
            <AiAssistantSpotlight />

            {/* 6. Data Portability Banner */}
            <DataPortabilityBanner />

            {/* 7. Final Conversion Banner */}
            <section className="py-20 bg-stone-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-rose-600/20 -z-10" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        Mulai langkah kecil menuju hidup yang lebih berkesadaran.
                    </h2>
                    <p className="mt-4 text-base text-stone-300 max-w-xl mx-auto">
                        Tidak perlu mengubah seluruh hidup dalam semalam. Cukup 10 detik hari ini untuk mencatat langkah pertamamu.
                    </p>
                    <div className="mt-8">
                        <Link
                            href={auth.user ? route('dashboard') : route('register')}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 shadow-xl shadow-amber-400/20 transition-all active:scale-95"
                        >
                            {auth.user ? 'Buka Dashboard Anda →' : 'Daftar Gratis Sekarang →'}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <LandingFooter />
        </div>
    );
}
