<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class SendEmailOtpNotification extends Notification
{
    use Queueable;

    public function __construct(
        public string $otp
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Kode Verifikasi Email Mindstep')
            ->greeting('Halo!')
            ->line('Gunakan kode verifikasi berikut untuk mengonfirmasi alamat email Anda:')
            ->line(new HtmlString('<p style="font-size: 32px; font-weight: bold; letter-spacing: 6px; text-align: center; margin: 20px 0;">'.$this->otp.'</p>'))
            ->line('Kode ini berlaku selama 15 menit.')
            ->line('Jangan bagikan kode ini kepada siapa pun.');
    }
}
