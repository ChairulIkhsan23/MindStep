import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ClipboardEvent,
    FormEventHandler,
    KeyboardEvent,
    useEffect,
    useRef,
    useState,
} from 'react';

interface Props {
    email: string;
    status?: string;
    canResendInSeconds?: number;
}

export default function VerifyEmailOtp({
    email,
    status,
    canResendInSeconds = 0,
}: Props) {
    const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState<number>(canResendInSeconds);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const verifyForm = useForm({
        otp: '',
    });

    const resendForm = useForm({});

    useEffect(() => {
        setCountdown(canResendInSeconds);
    }, [canResendInSeconds]);

    useEffect(() => {
        if (countdown <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleDigitChange = (index: number, value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (!cleaned && value !== '') {
            return;
        }

        const nextDigits = [...digits];
        nextDigits[index] = cleaned.slice(-1);
        setDigits(nextDigits);

        const fullOtp = nextDigits.join('');
        verifyForm.setData('otp', fullOtp);

        if (cleaned && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        index: number,
        e: KeyboardEvent<HTMLInputElement>,
    ) => {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData
            .getData('text')
            .replace(/\D/g, '')
            .slice(0, 6);

        if (!pastedData) {
            return;
        }

        const nextDigits = ['', '', '', '', '', ''];
        for (let i = 0; i < pastedData.length; i++) {
            nextDigits[i] = pastedData[i];
        }

        setDigits(nextDigits);
        verifyForm.setData('otp', pastedData);

        const nextFocusIndex = Math.min(pastedData.length, 5);
        inputRefs.current[nextFocusIndex]?.focus();
    };

    const handleVerifySubmit: FormEventHandler = (e) => {
        e.preventDefault();
        verifyForm.post(route('verification.otp.verify'));
    };

    const handleResendSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (countdown > 0 || resendForm.processing) {
            return;
        }

        resendForm.post(route('verification.otp.resend'), {
            onSuccess: () => {
                setCountdown(60);
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi Email" />

            <div className="mb-4 text-center">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Verifikasi Alamat Email
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Masukkan 6 digit kode OTP yang kami kirimkan ke:
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-200">
                    {email}
                </p>
            </div>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600 dark:text-green-400">
                    {status}
                </div>
            )}

            <form onSubmit={handleVerifySubmit} className="space-y-6">
                <div>
                    <div
                        className="flex justify-center gap-2 sm:gap-3"
                        onPaste={handlePaste}
                    >
                        {digits.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={digit}
                                onChange={(e) =>
                                    handleDigitChange(index, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="h-12 w-11 rounded-lg border border-gray-300 bg-white text-center text-xl font-bold text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                                aria-label={`Digit OTP ${index + 1}`}
                            />
                        ))}
                    </div>

                    <InputError
                        message={verifyForm.errors.otp}
                        className="mt-3 text-center"
                    />
                </div>

                <div className="flex flex-col items-center gap-3">
                    <PrimaryButton
                        className="w-full justify-center"
                        disabled={
                            verifyForm.processing ||
                            digits.join('').length !== 6
                        }
                    >
                        Verifikasi Kode
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-6 flex flex-col items-center gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Tidak menerima kode?{' '}
                    {countdown > 0 ? (
                        <span className="font-semibold text-gray-500">
                            Kirim ulang dalam {countdown} detik
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResendSubmit}
                            disabled={resendForm.processing}
                            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                        >
                            Kirim Ulang OTP
                        </button>
                    )}
                </div>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="text-xs text-gray-500 underline hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    Keluar / Ganti Akun
                </Link>
            </div>
        </GuestLayout>
    );
}
