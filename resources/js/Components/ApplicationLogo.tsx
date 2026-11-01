import { SVGAttributes } from 'react';

export default function ApplicationLogo(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="110 160 290 190"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Left Base & Stairs (Deep Amber Orange) */}
            <path
                d="M 128 332 H 242 V 258 L 287 303 L 287 263 L 242 218 H 204 V 256 H 166 V 294 H 128 Z"
                fill="#CE5C00"
            />

            {/* Right M Wing and Pillar (Vibrant Orange) */}
            <path
                d="M 344 332 V 246 L 287 303 L 260 276 L 356 180 H 370 L 382 192 V 332 H 344 Z"
                fill="#FF8E00"
            />

            {/* Center Overlap Facet Shadow */}
            <path
                d="M 260 276 L 287 263 L 287 303 Z"
                fill="#B94B00"
            />

            {/* Head / Person Dot */}
            <circle
                cx="287"
                cy="198"
                r="20.5"
                fill="#EB6B00"
            />
        </svg>
    );
}
