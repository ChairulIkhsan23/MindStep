import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import LandingNavbar from '@/Components/Landing/LandingNavbar';
import MarkerHighlight from '@/Components/Landing/MarkerHighlight';
import EmoticonJourneyIllustration from '@/Components/Landing/EmoticonJourneyIllustration';
import StoryBehindMindstep from '@/Components/Landing/StoryBehindMindstep';
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

            {/* 2. Hero Section (Full Viewport Height) */}
            <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 lg:py-0 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center w-full">
                        {/* Hero Text */}
                        <div className="lg:col-span-6 text-center lg:text-left">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 leading-[1.16]">
                                Bangun rutinitas, pantau mood, dan dokumentasikan{' '}
                                <MarkerHighlight
                                    highlight="aktivitas harianmu."
                                    markerColor="bg-gradient-to-r from-amber-400/40 via-rose-400/35 to-amber-400/40 dark:from-amber-500/30 dark:via-rose-500/25 dark:to-amber-500/30"
                                    className="text-stone-900 dark:text-stone-100"
                                />
                            </h1>

                            <p className="mt-6 text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                Kelola kebiasaan harian, catat suasana hati, dan tulis jurnal dengan mudah. Semua fitur yang kamu butuhkan untuk mengatur rutinitas dan memantau progres sudah siap digunakan. Dilengkapi AI reflektif yang membantu merapikan tulisan dan memberikan pertanyaan untuk refleksi harian.
                            </p>

                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm shadow-amber-600/25 transition-all active:scale-95 flex items-center justify-center gap-2"
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
                                            className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-base font-bold text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white shadow-sm transition-all active:scale-95 text-center"
                                        >
                                            Mulai Sekarang, Gratis
                                        </Link>
                                        <a
                                            href="#features"
                                            className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-base font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-center"
                                        >
                                            Pelajari Fitur
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Emoticon Journey Illustration */}
                        <div className="lg:col-span-6 flex justify-center">
                            <EmoticonJourneyIllustration />
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. The Story Behind Mindstep */}
            <StoryBehindMindstep />

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
                            {auth.user ? 'Buka Dashboard Anda' : 'Daftar Akun Gratis'}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <LandingFooter />
        </div>
    );
}
