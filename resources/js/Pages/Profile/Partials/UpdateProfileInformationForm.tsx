import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const COMMON_TIMEZONES = [
    { value: 'Asia/Jakarta', label: 'Asia/Jakarta (WIB, UTC+7)' },
    { value: 'Asia/Makassar', label: 'Asia/Makassar (WITA, UTC+8)' },
    { value: 'Asia/Jayapura', label: 'Asia/Jayapura (WIT, UTC+9)' },
    { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT, UTC+8)' },
    { value: 'UTC', label: 'UTC (Universal Coordinated Time)' },
    { value: 'America/New_York', label: 'America/New_York (EST/EDT)' },
    { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST/PDT)' },
    { value: 'Europe/London', label: 'Europe/London (GMT/BST)' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST, UTC+9)' },
    { value: 'Australia/Sydney', label: 'Australia/Sydney (AEST/AEDT)' },
];

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            timezone: user.timezone ?? 'Asia/Jakarta',
            theme: user.theme ?? 'system',
            ai_consent: user.ai_consent ?? false,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Informasi Profil & Preferensi
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Perbarui nama akun, alamat email, zona waktu harian, tema antarmuka, dan privasi AI.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Alamat Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                            Alamat email Anda belum terverifikasi.{' '}
                            <Link
                                href={route('verification.notice')}
                                className="rounded-md text-sm text-indigo-600 underline hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-indigo-400 dark:hover:text-indigo-200"
                            >
                                Klik di sini untuk memverifikasi via OTP.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                Kode verifikasi baru telah dikirimkan ke email Anda.
                            </div>
                        )}
                    </div>
                )}

                <div>
                    <InputLabel htmlFor="timezone" value="Zona Waktu" />

                    <select
                        id="timezone"
                        value={data.timezone}
                        onChange={(e) => setData('timezone', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                    >
                        {COMMON_TIMEZONES.map((tz) => (
                            <option key={tz.value} value={tz.value}>
                                {tz.label}
                            </option>
                        ))}
                    </select>

                    <InputError className="mt-2" message={errors.timezone} />
                </div>

                <div>
                    <InputLabel value="Tema Tampilan" />

                    <div className="mt-2 grid grid-cols-3 gap-3">
                        {(['light', 'dark', 'system'] as const).map((mode) => (
                            <label
                                key={mode}
                                className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm font-medium capitalize transition-colors ${
                                    data.theme === mode
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300'
                                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="theme"
                                    value={mode}
                                    checked={data.theme === mode}
                                    onChange={() => setData('theme', mode)}
                                    className="sr-only"
                                />
                                {mode === 'light'
                                    ? 'Terang'
                                    : mode === 'dark'
                                      ? 'Gelap'
                                      : 'Sistem'}
                            </label>
                        ))}
                    </div>

                    <InputError className="mt-2" message={errors.theme} />
                </div>

                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <Checkbox
                            name="ai_consent"
                            checked={data.ai_consent}
                            onChange={(e) =>
                                setData('ai_consent', e.target.checked)
                            }
                            className="mt-1"
                        />
                        <div className="text-sm">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                Izin Pemrosesan AI untuk Jurnal & Kebiasaan
                            </span>
                            <p className="text-gray-600 dark:text-gray-400">
                                Izinkan fitur AI menganalisis sentimen jurnal, memberikan refleksi positif, dan rekomendasi kebiasaan. Data Anda tidak digunakan untuk melatih model publik.
                            </p>
                        </div>
                    </label>

                    <InputError className="mt-2" message={errors.ai_consent} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Simpan Perubahan</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Tersimpan.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
