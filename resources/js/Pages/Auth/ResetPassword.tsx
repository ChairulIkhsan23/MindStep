import InputError from '@/Components/InputError';
import AuthSplitLayout from '@/Layouts/AuthSplitLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthSplitLayout mode="reset-password">
            <Head title="Reset Kata Sandi - MindStep" />

            <div className="mb-5 sm:mb-6">
                <span className="block text-[11px] font-semibold tracking-wider uppercase text-amber-700 dark:text-amber-400">
                    Keamanan Akun
                </span>
                <h1 className="mt-1 text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
                    Atur Ulang Kata Sandi
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    Silakan tentukan kata sandi baru yang kuat untuk mengamankan kembali akun MindStep kamu.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                {/* Email Field */}
                <div>
                    <label
                        htmlFor="email"
                        className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1"
                    >
                        Alamat Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        disabled={processing}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-900 dark:text-stone-100 text-sm placeholder:text-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-sm"
                    />
                    <InputError message={errors.email} className="mt-1" />
                </div>

                {/* Password Field */}
                <div>
                    <label
                        htmlFor="password"
                        className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1"
                    >
                        Kata Sandi Baru
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            placeholder="Minimal 8 karakter"
                            autoComplete="new-password"
                            autoFocus
                            disabled={processing}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-900 dark:text-stone-100 text-sm placeholder:text-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors p-1"
                            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-1" />
                </div>

                {/* Confirm Password Field */}
                <div>
                    <label
                        htmlFor="password_confirmation"
                        className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1"
                    >
                        Konfirmasi Kata Sandi Baru
                    </label>
                    <div className="relative">
                        <input
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            placeholder="Ulangi kata sandi baru"
                            autoComplete="new-password"
                            disabled={processing}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            required
                            className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-900 dark:text-stone-100 text-sm placeholder:text-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors p-1"
                            aria-label={
                                showConfirmPassword
                                    ? 'Sembunyikan konfirmasi kata sandi'
                                    : 'Tampilkan konfirmasi kata sandi'
                            }
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1"
                    />
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
                            <span>Menyimpan Kata Sandi...</span>
                        </>
                    ) : (
                        <>
                            <span>Simpan Kata Sandi Baru</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>
        </AuthSplitLayout>
    );
}
