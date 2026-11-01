import { ImgHTMLAttributes } from 'react';

export default function ApplicationLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/logo.png"
            alt="MindStep Logo"
            {...props}
            className={`object-contain ${props.className || 'w-8 h-8'}`}
        />
    );
}
