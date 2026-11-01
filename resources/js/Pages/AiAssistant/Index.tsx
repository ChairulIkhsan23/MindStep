import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    Bot,
    Compass,
    HelpCircle,
    Lightbulb,
    Lock,
    MessageSquare,
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-[#EFF6FF] text-[#1D63ED] border border-[#DBEAFE]">
                                AI Coach & Refleksi
                            </span>
                        </div>
                        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0F172A]">
                            MindStep AI Assistant
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
                            Mitra cerdas untuk membantu mengevaluasi kebiasaan, merapikan tulisan jurnal, dan memberikan dorongan positif.
                        </p>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] text-xs font-semibold text-[#64748B]">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Data Terenkripsi & Privat</span>
                    </div>
                </div>

                {/* AI Welcome Card */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#1D63ED] flex items-center justify-center shrink-0 border border-[#DBEAFE]">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-[#0F172A]">
                                Halo! Saya MindStep AI Coach siap membantumu hari ini.
                            </h3>
                            <p className="mt-1 text-xs sm:text-sm text-[#475569] leading-relaxed">
                                Saya dapat menganalisis korelasi antara rutinitas harian dan skor mood Anda, membantu memperdalam catatan jurnal refleksi, atau merancang strategi perbaikan kebiasaan yang realistis.
                            </p>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-[#E2E8F0]">
                        <p className="text-xs font-bold text-[#64748B] mb-2.5">
                            Coba tanyakan atau pilih topik di bawah ini:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {suggestions.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setPrompt(item)}
                                    className="p-3 text-left rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#DBEAFE] hover:bg-[#EFF6FF] text-xs font-semibold text-[#334155] transition-all flex items-start gap-2"
                                >
                                    <Lightbulb className="w-3.5 h-3.5 text-[#1D63ED] shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Interactive Prompt Input Box */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-sm space-y-3">
                    <div className="relative">
                        <textarea
                            rows={3}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Tuliskan pertanyaan, keluhan kebiasaan, atau draf jurnal yang ingin dibedah..."
                            className="w-full p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1D63ED] focus:ring-2 focus:ring-[#1D63ED]/15 transition-all resize-none"
                        />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                        <span className="text-[#64748B] text-[11px]">
                            Didukung model bahasa cerdas dengan konteks jurnal lokal
                        </span>

                        <button
                            onClick={() => {
                                if (prompt.trim()) {
                                    alert('MindStep AI sedang menganalisis prompt Anda...');
                                    setPrompt('');
                                }
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1D63ED] text-white font-bold text-xs hover:bg-[#1E40AF] transition-colors shadow-sm"
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
