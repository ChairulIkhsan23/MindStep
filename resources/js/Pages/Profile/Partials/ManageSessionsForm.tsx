import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function ManageSessionsForm({
    className = '',
}: {
    className?: string;
}) {
    const [confirmingLogout, setConfirmingLogout] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
        recentlySuccessful,
    } = useForm({
        password: '',
    });

    const confirmLogout = () => {
        setConfirmingLogout(true);
    };

    const logoutOtherSessions: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.sessions.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingLogout(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Sesi Perangkat Aktif
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Kelola dan keluar dari sesi aktif Anda di perangkat atau peramban lain. Jika mencurigai akun diakses orang lain, Anda juga disarankan untuk mengubah kata sandi.
                </p>
            </header>

            <div className="flex items-center gap-4">
                <DangerButton onClick={confirmLogout}>
                    Keluar Dari Sesi Perangkat Lain
                </DangerButton>

                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                >
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Sesi lain berhasil dihentikan.
                    </p>
                </Transition>
            </div>

            <Modal show={confirmingLogout} onClose={closeModal}>
                <form onSubmit={logoutOtherSessions} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Keluar dari semua sesi perangkat lain?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Harap masukkan kata sandi akun Anda untuk mengonfirmasi bahwa Anda ingin memutuskan semua sesi di peramban dan perangkat lain.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="session_password"
                            value="Kata Sandi"
                            className="sr-only"
                        />

                        <TextInput
                            id="session_password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder="Kata Sandi Akun"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Batal
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            Konfirmasi & Putus Sesi
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
