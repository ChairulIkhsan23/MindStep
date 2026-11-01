import InputError from '@/Components/InputError';
import AuthSplitLayout from '@/Layouts/AuthSplitLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Loader2, MailCheck } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <AuthSplitLayout mode="forgot-password">
            <Head title="Lupa Kata Sandi - MindStep" />

            <div className="mb-5 sm:mb-6">
                <Link
                    href={route('login')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors mb-3"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke halaman Masuk</span>
                </Link>

                <span className="block text-[11px] font-semibold tracking-wider uppercase text-amber-700 dark:text-amber-400">
                    Pemulihan Akun
                </span>
                <h1 className="mt-1 text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
                    Lupa Kata Sandi?
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    Jangan khawatir! Masukkan alamat email akun MindStep kamu dan kami akan mengirimkan tautan reset kata sandi baru.
                </p>
            </div>

            {status && (
                <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm font-medium text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
                    <MailCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{status}</span>
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                {/* Email Field */}
                <div>
                    <label
                        htmlFor="email"
                        className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1"
                    >
                        Alamat Email Akun
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="nama@email.com"
                        autoComplete="username"
                        autoFocus
                        disabled={processing}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-900 dark:text-stone-100 text-sm placeholder:text-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-sm"
                    />
                    <InputError message={errors.email} className="mt-1" />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl font-bold text-sm text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {processing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Mengirim Tautan...</span>
                        </>
                    ) : (
                        <>
                            <span>Kirim Tautan Reset</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>
        </AuthSplitLayout>
    );
}
