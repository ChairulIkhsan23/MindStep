import InputError from '@/Components/InputError';
import AuthSplitLayout from '@/Layouts/AuthSplitLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthSplitLayout mode="register">
            <Head title="Daftar Akun Baru - MindStep" />

            <div className="mb-8">
                <span className="text-xs font-semibold tracking-wider uppercase text-amber-700 dark:text-amber-400">
                    Mulai Perjalananmu
                </span>
                <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
                    Buat Akun MindStep
                </h1>
                <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    Buat akun untuk mulai mencatat kebiasaan dan aktivitas harianmu.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4 sm:space-y-5">
                {/* Name Field */}
                <div>
                    <label
                        htmlFor="name"
                        className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2"
                    >
                        Nama Lengkap
                    </label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={data.name}
                        placeholder="Nama kamu"
                        autoComplete="name"
                        autoFocus
                        disabled={processing}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-900 dark:text-stone-100 text-sm placeholder:text-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-sm"
                    />
                    <InputError message={errors.name} className="mt-1.5" />
                </div>

                {/* Email Field */}
                <div>
                    <label
                        htmlFor="email"
                        className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2"
                    >
                        Alamat Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="nama@email.com"
                        autoComplete="username"
                        disabled={processing}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-900 dark:text-stone-100 text-sm placeholder:text-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-sm"
                    />
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                {/* Password Field */}
                <div>
                    <label
                        htmlFor="password"
                        className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2"
                    >
                        Kata Sandi
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            placeholder="Minimal 8 karakter"
                            autoComplete="new-password"
                            disabled={processing}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            className="w-full pl-4 pr-11 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-900 dark:text-stone-100 text-sm placeholder:text-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors p-1"
                            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                {/* Password Confirmation Field */}
                <div>
                    <label
                        htmlFor="password_confirmation"
                        className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2"
                    >
                        Konfirmasi Kata Sandi
                    </label>
                    <div className="relative">
                        <input
                            id="password_confirmation"
                            type={showConfirmation ? 'text' : 'password'}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            placeholder="Ulangi kata sandi"
                            autoComplete="new-password"
                            disabled={processing}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            required
                            className="w-full pl-4 pr-11 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-900 dark:text-stone-100 text-sm placeholder:text-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmation((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors p-1"
                            aria-label={showConfirmation ? 'Sembunyikan konfirmasi kata sandi' : 'Tampilkan konfirmasi kata sandi'}
                        >
                            {showConfirmation ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1.5"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full mt-3 py-3.5 px-6 rounded-xl font-bold text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white shadow-sm transition-all active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                    {processing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Membuat akun...</span>
                        </>
                    ) : (
                        <>
                            <span>Buat Akun MindStep</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>

                {/* Link to Login */}
                <div className="pt-4 text-center border-t border-stone-100 dark:border-stone-800">
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                        Sudah memiliki akun?{' '}
                        <Link
                            href={route('login')}
                            className="font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                        >
                            Masuk di sini
                        </Link>
                    </p>
                </div>
            </form>
        </AuthSplitLayout>
    );
}
