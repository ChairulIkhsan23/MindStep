import { Link } from '@inertiajs/react';

export default function LandingFooter() {
    return (
        <footer className="bg-white dark:bg-stone-950 text-stone-600 dark:text-stone-400 border-t border-stone-200 dark:border-stone-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Legal Non-Clinical Disclaimer */}
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 mb-8">
                    <p className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed text-center sm:text-left">
                        <strong>Penafian Hukum Medis:</strong> Mindstep adalah platform digital untuk pelacakan kebiasaan pribadi dan refleksi pikiran non-klinis. Seluruh fitur AI dirancang sebagai fasilitator introspeksi diri, bukan merupakan alat pengganti nasihat medis, evaluasi psikiatri, atau penanganan psikologis profesional. Jika Anda menghadapi krisis kesehatan mental atau bahaya diri, harap segera menghubungi layanan darurat kesehatan setempat.
                    </p>
                </div>

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
