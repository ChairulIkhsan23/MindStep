import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Heart,
    Plus,
    Smile,
    Sparkles,
    TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

export default function MoodsIndex() {
    const [selectedScore, setSelectedScore] = useState<number>(4);

    const moodScales = [
        { score: 1, emoji: '😫', label: 'Buruk', desc: 'Sangat tertekan atau down' },
        { score: 2, emoji: '😕', label: 'Kurang Baik', desc: 'Gelisah, cemas, atau lelah' },
        { score: 3, emoji: '😐', label: 'Netral', desc: 'Biasa saja, seimbang' },
        { score: 4, emoji: '😊', label: 'Baik', desc: 'Tenang, bersyukur, lega' },
        { score: 5, emoji: '✨', label: 'Sangat Hebat', desc: 'Bersemangat, penuh energi' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Mood & Emosi - MindStep" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-[#EFF6FF] text-[#1D63ED] border border-[#DBEAFE]">
                                Kebugaran Emosional
                            </span>
                        </div>
                        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0F172A]">
                            Mood & Emosi
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
                            Kenali dinamika suasana hati harianmu untuk menjaga keseimbangan kesehatan mental.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#1D63ED] hover:bg-[#1E40AF] shadow-sm shadow-[#1D63ED]/20">
                            <Plus className="w-4 h-4" />
                            <span>Catat Mood Baru</span>
                        </button>
                    </div>
                </div>

                {/* Mood Overview Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
                        <span className="text-xs font-semibold text-[#64748B]">Rata-rata Mood Pekan Ini</span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-[#0F172A]">4.4</span>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                +12% vs pekan lalu
                            </span>
                        </div>
                        <p className="mt-1.5 text-xs text-[#64748B]">Dominan: Tenang & Bersyukur</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
                        <span className="text-xs font-semibold text-[#64748B]">Hari Terstabil</span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-[#0F172A]">Kamis & Selasa</span>
                        </div>
                        <p className="mt-1.5 text-xs text-[#64748B]">Skor rata-rata 4.8 / 5.0</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
                        <span className="text-xs font-semibold text-[#64748B]">Total Catatan Emosi</span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-[#0F172A]">28 Log</span>
                        </div>
                        <p className="mt-1.5 text-xs text-[#64748B]">Konsisten tercatat setiap pagi & malam</p>
                    </div>
                </div>

                {/* Quick Check-in Interactive Box */}
                <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-extrabold text-[#0F172A]">
                            Check-in Suasana Hati Cepat
                        </h3>
                        <span className="text-xs text-[#64748B]">Hari ini, 24 Oktober 2024</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                        {moodScales.map((item) => (
                            <button
                                key={item.score}
                                onClick={() => setSelectedScore(item.score)}
                                className={`p-4 rounded-2xl border text-center transition-all ${
                                    selectedScore === item.score
                                        ? 'bg-[#EFF6FF] border-[#1D63ED] ring-2 ring-[#1D63ED]/20'
                                        : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                                }`}
                            >
                                <span className="text-3xl block mb-2">{item.emoji}</span>
                                <h4 className="text-xs font-bold text-[#0F172A]">{item.label}</h4>
                                <p className="text-[10px] text-[#64748B] mt-0.5">{item.desc}</p>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-end pt-2">
                        <button
                            onClick={() => alert('Log mood berhasil disimpan!')}
                            className="px-5 py-2.5 rounded-xl bg-[#1D63ED] hover:bg-[#1E40AF] text-white font-bold text-xs shadow-sm transition-colors"
                        >
                            Konfirmasi Catatan Mood
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
