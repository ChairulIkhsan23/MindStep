import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { AlertCircle, AlertTriangle, Info, LucideIcon, Trash2 } from 'lucide-react';
import { ReactNode } from 'react';

export interface ConfirmDialogProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    processing?: boolean;
    icon?: LucideIcon;
}

export default function ConfirmDialog({
    show,
    onClose,
    onConfirm,
    title = 'Konfirmasi Tindakan',
    message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
    confirmText = 'Konfirmasi',
    cancelText = 'Batal',
    variant = 'danger',
    processing = false,
    icon,
}: ConfirmDialogProps) {
    const IconComponent =
        icon ||
        (variant === 'danger'
            ? Trash2
            : variant === 'warning'
            ? AlertCircle
            : Info);

    const iconColorClasses = {
        danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
        warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        info: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    }[variant];

    const confirmButtonClasses = {
        danger: 'bg-rose-600 hover:bg-rose-700 text-white',
        warning: 'bg-amber-600 hover:bg-amber-700 text-white',
        info: 'bg-sky-600 hover:bg-sky-700 text-white',
    }[variant];

    return (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
                onClose={() => {
                    if (!processing) onClose();
                }}
            >
                {/* Backdrop */}
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity" />
                </TransitionChild>

                {/* Dialog Content */}
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-3 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-3 sm:translate-y-0 sm:scale-95"
                >
                    <DialogPanel className="relative w-full max-w-sm rounded-xl bg-white dark:bg-stone-900 p-5 text-center shadow-xl border border-stone-200 dark:border-stone-800 transition-all">
                        {/* Icon Badge */}
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 ${iconColorClasses}`}
                        >
                            <IconComponent className="w-5 h-5" />
                        </div>

                        {/* Title */}
                        <DialogTitle
                            as="h3"
                            className="text-sm font-semibold text-stone-900 dark:text-stone-100"
                        >
                            {title}
                        </DialogTitle>

                        {/* Description / Message */}
                        <div className="mt-1 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                            {message}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex items-center gap-2">
                            <button
                                type="button"
                                disabled={processing}
                                onClick={onClose}
                                className="flex-1 py-1.5 px-3 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 transition disabled:opacity-50"
                            >
                                {cancelText}
                            </button>
                            <button
                                type="button"
                                disabled={processing}
                                onClick={onConfirm}
                                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition disabled:opacity-50 ${confirmButtonClasses}`}
                            >
                                {processing ? 'Memproses...' : confirmText}
                            </button>
                        </div>
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
