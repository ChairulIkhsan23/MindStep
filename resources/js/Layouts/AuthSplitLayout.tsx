import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { CheckCircle2, Flame, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { ReactNode } from 'react';

interface AuthSplitLayoutProps {
    children: ReactNode;
    mode: 'login' | 'register';
}

export default function AuthSplitLayout({ children, mode }: AuthSplitLayoutProps) {
    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 antialiased selection:bg-amber-500 selection:text-white flex flex-col justify-between">
            {/* Top Minimal Bar */}
            <header className="w-full border-b border-stone-200/80 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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

            {/* Main Content: Two Columns on lg */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center">
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left Column: Brand Experience (Desktop & Tablet) */}
                    <aside className="lg:col-span-6 flex flex-col gap-5 order-2 lg:order-1">
                        {/* A. Hero / Daily Reflection Card */}
                        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/90 dark:border-stone-800 bg-stone-900 text-white p-6 sm:p-8 shadow-sm">
                            {/* Peaceful Warm Gradient Artwork Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 -z-10" />
                            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none -z-10" />
                            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-rose-500/10 blur-3xl pointer-events-none -z-10" />

                            <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase text-amber-400">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Refleksi Harian</span>
                            </div>

                            <blockquote className="mt-4 text-lg sm:text-xl font-bold tracking-tight text-stone-100 leading-snug">
                                &ldquo;Langkah kecil yang diulang setiap hari jauh lebih bermakna daripada lompatan besar yang hanya bertahan sesaat.&rdquo;
                            </blockquote>

                            <div className="mt-4 pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                                <span>Kunci Konsistensi Rutinitas</span>
                                <span className="font-mono text-stone-500">MindStep Focus</span>
                            </div>
                        </div>

                        {/* B. Activity Overview Cards (Two Side-by-Side) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Habit Progress Card */}
                            <div className="rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                                        Progres Kebiasaan
                                    </span>
                                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                        <Flame className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-3 flex items-baseline gap-2">
                                    <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
                                        14 Hari
                                    </span>
                                    <span className="text-xs text-stone-500 dark:text-stone-400">Streak aktif</span>
                                </div>
                                {/* Simple weekly tracker pills */}
                                <div className="mt-3 flex items-center gap-1.5">
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
                            <div className="rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                                        Tren Suasana Hati
                                    </span>
                                    <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-3 flex items-baseline gap-2">
                                    <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
                                        Stabil
                                    </span>
                                    <span className="text-xs text-stone-500 dark:text-stone-400">Pekan ini</span>
                                </div>
                                {/* Mood summary scale indicators */}
                                <div className="mt-3 flex items-center justify-between text-base px-1 py-1 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200/60 dark:border-stone-800">
                                    <span title="Buruk" className="opacity-40">😔</span>
                                    <span title="Kurang Baik" className="opacity-40">😕</span>
                                    <span title="Biasa" className="opacity-40">😐</span>
                                    <span title="Baik" className="scale-110 drop-shadow">🙂</span>
                                    <span title="Sangat Baik" className="opacity-60">😊</span>
                                </div>
                            </div>
                        </div>

                        {/* C. Privacy Information Card */}
                        <div className="rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-sm flex items-start gap-3.5">
                            <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="text-xs">
                                <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                                    Catatan Pribadimu Tetap Aman
                                </h4>
                                <p className="mt-1 text-stone-600 dark:text-stone-400 leading-relaxed">
                                    Jurnal, emosi harian, dan kebiasaanmu hanya dapat diakses oleh akunmu. Kamu memiliki kendali penuh atas datamu setiap saat.
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Right Column: Authentication Form Card */}
                    <div className="lg:col-span-6 w-full order-1 lg:order-2">
                        <div className="w-full max-w-xl mx-auto rounded-2xl sm:rounded-3xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-10 shadow-sm">
                            {children}
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Footer Note */}
            <footer className="w-full py-5 text-center text-xs text-stone-500 dark:text-stone-400 border-t border-stone-200/80 dark:border-stone-800">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
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
