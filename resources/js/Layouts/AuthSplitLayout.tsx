import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CheckCircle2, Flame, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { ReactNode } from 'react';

interface AuthSplitLayoutProps {
    children: ReactNode;
    mode: 'login' | 'register';
}

export default function AuthSplitLayout({ children, mode }: AuthSplitLayoutProps) {
    return (
        <div className="min-h-screen lg:h-screen w-full bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 antialiased selection:bg-amber-500 selection:text-white flex flex-col justify-between overflow-x-hidden lg:overflow-hidden">
            {/* Top Bar */}
            <header className="w-full shrink-0 h-16 border-b border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <ApplicationLogo className="w-8 h-8 group-hover:scale-105 transition-transform" />
                        <span className="font-bold text-xl tracking-tight text-stone-900 dark:text-stone-100">
                            Mind<span className="text-amber-600 dark:text-amber-400">Step</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                        <span>{mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}</span>
                        <Link
                            href={mode === 'login' ? route('register') : route('login')}
                            className="font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 underline underline-offset-4 transition-colors"
                        >
                            {mode === 'login' ? 'Daftar' : 'Masuk'}
                        </Link>
                    </div>
                </div>
            </header>

            {/* Split Content Area */}
            <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 min-h-0 py-6 lg:py-4 items-center">
                {/* Left Column: Brand Experience (Animated Fade In) */}
                <motion.aside
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="lg:col-span-6 flex flex-col justify-center gap-3.5 xl:gap-4 order-2 lg:order-1 select-none"
                >
                    {/* A. Hero / Daily Reflection Card */}
                    <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/90 dark:border-stone-800 text-white p-5 sm:p-6 shadow-sm min-h-[170px] sm:min-h-[190px] flex flex-col justify-between">
                        {/* High-res peaceful journaling & plant desk directly from Unsplash CDN */}
                        <img
                            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80"
                            alt="Suasana tenang meja baca refleksi dan kebiasaan harian"
                            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                        />
                        {/* Soft subtle gradient overlay so image shines through while text stays crisp */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25 pointer-events-none" />

                        {/* Top Label */}
                        <div className="relative z-10">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-white shadow-sm">
                                Refleksi Harian
                            </span>
                        </div>

                        {/* Quote & Attribution */}
                        <div className="relative z-10 mt-3">
                            <blockquote className="text-base sm:text-lg font-bold tracking-tight text-white leading-snug drop-shadow-md">
                                &ldquo;Kemajuan bukanlah lompatan raksasa, melainkan satu langkah sadar yang diulang setiap hari.&rdquo;
                            </blockquote>

                            <p className="mt-2 text-xs text-stone-200 font-medium drop-shadow-md">
                                &mdash; James Clear, Filosofi Kaizen
                            </p>
                        </div>
                    </div>

                    {/* B. Activity Overview Cards (Two Side-by-Side) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Habit Progress Card */}
                        <div className="rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                                    Progres Kebiasaan
                                </span>
                                <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                    <Flame className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100">
                                    14 Hari
                                </span>
                                <span className="text-xs text-stone-500 dark:text-stone-400">Streak aktif</span>
                            </div>
                            <div className="mt-2 flex items-center gap-1.5">
                                {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((day, idx) => (
                                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                                        <div
                                            className={`w-full h-1.5 rounded-full ${
                                                idx < 6
                                                    ? 'bg-amber-600 dark:bg-amber-500'
                                                    : 'bg-stone-200 dark:bg-stone-800'
                                            }`}
                                        />
                                        <span className="text-[10px] text-stone-400 font-mono">{day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mood Overview Card */}
                        <div className="rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                                    Tren Suasana Hati
                                </span>
                                <div className="w-6 h-6 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            <div className="mt-2 flex items-baseline gap-2">
                                <span className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100">
                                    Stabil
                                </span>
                                <span className="text-xs text-stone-500 dark:text-stone-400">Pekan ini</span>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-sm sm:text-base px-2 py-0.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200/60 dark:border-stone-800">
                                <span title="Buruk" className="opacity-40">😔</span>
                                <span title="Kurang Baik" className="opacity-40">😕</span>
                                <span title="Biasa" className="opacity-40">😐</span>
                                <span title="Baik" className="scale-110 drop-shadow">🙂</span>
                                <span title="Sangat Baik" className="opacity-60">😊</span>
                            </div>
                        </div>
                    </div>

                    {/* C. Privacy Information Card */}
                    <div className="rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 shadow-sm flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="text-xs">
                            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                                Catatan Pribadimu Tetap Aman
                            </h4>
                            <p className="mt-0.5 text-stone-600 dark:text-stone-400 leading-relaxed">
                                Jurnal, emosi harian, dan kebiasaanmu hanya dapat diakses oleh akunmu. Kamu memiliki kendali penuh atas datamu setiap saat.
                            </p>
                        </div>
                    </div>
                </motion.aside>

                {/* Right Column: Scrollable Form Area */}
                <main className="lg:col-span-6 w-full order-1 lg:order-2 lg:h-full lg:overflow-y-auto py-2 lg:py-3 flex flex-col justify-center">
                    <div className="w-full max-w-xl mx-auto rounded-2xl sm:rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 sm:p-7 shadow-sm my-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Bottom Footer Note */}
            <footer className="w-full shrink-0 py-3 text-center text-xs text-stone-500 dark:text-stone-400 border-t border-stone-200/80 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 backdrop-blur-sm z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-stone-400" />
                        <span>Koneksi aman dengan enkripsi standar industri.</span>
                    </div>
                    <span>© {new Date().getFullYear()} MindStep. Hak Cipta Dilindungi.</span>
                </div>
            </footer>
        </div>
    );
}
