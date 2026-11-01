import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    Lightbulb,
    Lock,
    Send,
    Sparkles,
} from 'lucide-react';
import { useState } from 'react';

export default function AiAssistantIndex() {
    const [prompt, setPrompt] = useState('');

    const suggestions = [
        'Bantu saya membuat rutinitas pagi 15 menit yang efektif',
        'Refleksikan pola mood saya yang menurun di hari Rabu',
        'Pertajam jurnal malam saya agar lebih mendalam',
        'Bagaimana cara konsisten membaca buku setiap hari?',
    ];

    return (
        <AuthenticatedLayout>
            <Head title="MindStep AI Assistant - MindStep" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200/90 dark:border-stone-800">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                                AI Coach & Refleksi
                            </span>
                        </div>
                        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
                            MindStep AI Assistant
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                            Mitra cerdas untuk membantu mengevaluasi kebiasaan, merapikan tulisan jurnal, dan memberikan dorongan positif.
                        </p>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 text-xs font-semibold text-stone-500 dark:text-stone-400">
                        <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Data Terenkripsi & Privat</span>
                    </div>
                </div>

                {/* AI Welcome Card */}
                <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-6 shadow-sm space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                                Halo! Saya MindStep AI Coach siap membantumu hari ini.
                            </h3>
                            <p className="mt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                                Saya dapat menganalisis korelasi antara rutinitas harian dan skor mood Anda, membantu memperdalam catatan jurnal refleksi, atau merancang strategi perbaikan kebiasaan yang realistis.
                            </p>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-stone-200/90 dark:border-stone-800">
                        <p className="text-xs font-bold text-stone-500 dark:text-stone-400 mb-2.5">
                            Coba tanyakan atau pilih topik di bawah ini:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {suggestions.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setPrompt(item)}
                                    className="p-3 text-left rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200/90 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-800 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 text-xs font-semibold text-stone-700 dark:text-stone-300 transition-all flex items-start gap-2"
                                >
                                    <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Interactive Prompt Input Box */}
                <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-4 shadow-sm space-y-3">
                    <div className="relative">
                        <textarea
                            rows={3}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Tuliskan pertanyaan, keluhan kebiasaan, atau draf jurnal yang ingin dibedah..."
                            className="w-full p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                        />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-500 dark:text-stone-400 text-[11px]">
                            Didukung model bahasa cerdas dengan konteks jurnal lokal
                        </span>

                        <button
                            onClick={() => {
                                if (prompt.trim()) {
                                    alert('MindStep AI sedang menganalisis prompt Anda...');
                                    setPrompt('');
                                }
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors shadow-sm"
                        >
                            <span>Kirim ke AI</span>
                            <Send className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
