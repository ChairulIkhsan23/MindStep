<?php

namespace App\Services\Ai\Drivers;

use App\Services\Ai\Contracts\AiDriverInterface;

class MockAiDriver implements AiDriverInterface
{
    public function polish(string $content, ?string $context = null): string
    {
        $cleanContent = trim(strip_tags($content));

        return "Hari ini saya merenungkan beberapa hal penting: {$cleanContent}. Pengalaman ini memberikan sudut pandang berharga tentang pentingnya menjaga ritme dan apresiasi terhadap proses yang sedang dijalani.";
    }

    public function deepeningPrompts(string $content, ?string $context = null): array
    {
        return [
            'Dari situasi yang kamu ceritakan ini, bagian mana yang sebenarnya paling berada di bawah kendalimu?',
            'Apa kebutuhan emosional terdalam yang sedang berusaha kamu penuhi saat ini?',
            'Jika seorang sahabat mengalami hal serupa, apa kalimat penguat yang akan kamu sampaikan kepadanya?',
        ];
    }

    public function periodicSummary(array $entries): string
    {
        $count = count($entries);

        return "Berdasarkan {$count} catatan refleksi Anda dalam periode ini, terlihat tema dominan seputar usaha menjaga konsistensi, proses adaptasi terhadap tantangan harian, serta pentingnya ruang istirahat yang cukup untuk pemulihan energi.";
    }
}
