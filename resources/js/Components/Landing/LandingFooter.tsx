import { Link } from '@inertiajs/react';

export default function LandingFooter() {
    return (
        <footer className="bg-white dark:bg-stone-950 text-stone-600 dark:text-stone-400 border-t border-stone-200 dark:border-stone-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 dark:text-stone-100">Mindstep</span>
                        <span>•</span>
                        <span>© {new Date().getFullYear()} Hak Cipta Dilindungi.</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href={route('login')} className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                            Masuk
                        </Link>
                        <Link href={route('register')} className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                            Daftar Akun
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
