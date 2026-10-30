import { useState } from 'react';
import { motion } from 'framer-motion';

export interface MarkerHighlightProps {
    before?: string;
    highlight: string;
    after?: string;
    markerColor?: string;
    highlightedTextColor?: string;
    speed?: number;
    className?: string;
}

export function MarkerHighlight({
    before = '',
    highlight,
    after = '',
    markerColor = 'bg-amber-400/35 dark:bg-amber-500/30',
    highlightedTextColor = '',
    speed = 1,
    className = '',
}: MarkerHighlightProps) {
    const [isInView, setIsInView] = useState(false);

    return (
        <span className={`inline ${className}`.trim()}>
            {before && <span>{before} </span>}
            <span className="relative inline-block whitespace-nowrap">
                <motion.span
                    aria-hidden
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    onViewportEnter={() => setIsInView(true)}
                    transition={{
                        type: 'spring',
                        damping: 15,
                        stiffness: 110,
                        delay: 0.2 / speed,
                    }}
                    className={`absolute inset-x-[-0.15em] bottom-1 top-2 -rotate-1 rounded-sm origin-left z-0 ${markerColor}`}
                />
                <span
                    className={`relative z-10 transition-colors ease-out ${
                        isInView && highlightedTextColor ? highlightedTextColor : ''
                    }`}
                    style={{
                        transitionDuration: `${0.25 / speed}s`,
                        transitionDelay: `${0.45 / speed}s`,
                    }}
                >
                    {highlight}
                </span>
            </span>
            {after && <span> {after}</span>}
        </span>
    );
}

export default MarkerHighlight;
