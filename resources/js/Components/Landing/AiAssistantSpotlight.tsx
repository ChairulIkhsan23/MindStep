export default function AiAssistantSpotlight() {
    return (
        <section id="ai-partner" className="py-24 bg-stone-900 text-stone-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="max-w-3xl mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-4">
                        Prinsip AI Non-Klinis
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                        AI Sebagai Mitra Pemantul Pikiran. Bukan Penasihat Medis.
                    </h2>
                    <p className="mt-4 text-base text-stone-300 leading-relaxed">
                        Kami percaya AI tidak boleh menggantikan intuisi manusia apalagi mendiagnosis kondisi kejiwaan. Mindstep AI dirancang khusus untuk memoles tulisan dan memantik introspeksi jujur.
                    </p>
                </div>

                {/* 3 Capabilities vs 3 Ethical Guardrails */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: 3 Core Capabilities */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                            3 Kapabilitas Reflektif Utama
                        </h3>

                        <div className="p-5 rounded-2xl bg-stone-800/80 border border-stone-700/80">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-sm">
                                    01
                                </span>
                                <h4 className="text-base font-bold text-white">
                                    Polish & Structure Draft
                                </h4>
                            </div>
                            <p className="text-xs text-stone-300 leading-relaxed pl-11">
                                Mengubah draf poin-poin kasar yang berserakan menjadi narasi mengalir rapi tanpa pernah menambah fakta fiktif atau mengubah opini asli Anda.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-stone-800/80 border border-stone-700/80">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-sm">
                                    02
                                </span>
                                <h4 className="text-base font-bold text-white">
                                    Deepening Reflection Prompts
                                </h4>
                            </div>
                            <p className="text-xs text-stone-300 leading-relaxed pl-11">
                                Menghasilkan tepat 3 pertanyaan pemantik filosofis dan empatik berdasarkan isi jurnal Anda untuk menggali perasaan dan perspektif lebih dalam.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-stone-800/80 border border-stone-700/80">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-sm">
                                    03
                                </span>
                                <h4 className="text-base font-bold text-white">
                                    Periodic Summary & Patterns
                                </h4>
                            </div>
                            <p className="text-xs text-stone-300 leading-relaxed pl-11">
                                Menyintesis pola pikir berulang dan tema emosional dominan dari kumpulan jurnal 7 atau 30 hari secara objektif dan membangun.
                            </p>
                        </div>
                    </div>

                    {/* Right: 3 Ethical Guardrails */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400">
                            3 Batasan Keamanan & Privasi Mutlak
                        </h3>

                        <div className="p-5 rounded-2xl bg-stone-800/50 border border-stone-800">
                            <div className="flex items-center gap-3 mb-2 text-rose-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <h4 className="text-base font-bold text-white">
                                    Persetujuan Eksplisit (Explicit Consent)
                                </h4>
                            </div>
                            <p className="text-xs text-stone-400 leading-relaxed pl-8">
                                Fitur AI non-aktif secara default. Tidak ada satu kata pun yang dikirim ke model sebelum Anda secara sadar mengaktifkannya di pengaturan akun.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-stone-800/50 border border-stone-800">
                            <div className="flex items-center gap-3 mb-2 text-rose-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                </svg>
                                <h4 className="text-base font-bold text-white">
                                    Sensor Identitas Pribadi (PII Masking)
                                </h4>
                            </div>
                            <p className="text-xs text-stone-400 leading-relaxed pl-8">
                                Nama asli dan alamat email disaring otomatis sebelum prompt dikirim. Server penyedia AI hanya menerima teks anonim terisolasi.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-stone-800/50 border border-stone-800">
                            <div className="flex items-center gap-3 mb-2 text-rose-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <h4 className="text-base font-bold text-white">
                                    Non-Destruktif & Penafian Medis
                                </h4>
                            </div>
                            <p className="text-xs text-stone-400 leading-relaxed pl-8">
                                AI tidak pernah menimpa draf tulisan asli Anda secara otomatis. Seluruh respon dilengkapi penafian hukum bahwa sistem bukan alat diagnosis kesehatan mental.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
