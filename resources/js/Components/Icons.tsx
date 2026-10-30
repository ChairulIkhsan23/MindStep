import { Check } from 'lucide-react';
import { DynamicIcon, iconNames } from 'lucide-react/dynamic';
import { ComponentProps, Suspense } from 'react';

type IconName = (typeof iconNames)[number];

interface IconsProps extends Omit<ComponentProps<typeof DynamicIcon>, 'name'> {
    name?: string | null;
    className?: string;
}

export default function Icons({
    name,
    className = 'h-5 w-5',
    ...props
}: IconsProps) {
    if (!name || !iconNames.includes(name as IconName)) {
        return <Check className={className} />;
    }

    return (
        <Suspense fallback={<div className={`${className} animate-pulse rounded bg-gray-200 dark:bg-gray-700`} />}>
            <DynamicIcon
                name={name as IconName}
                className={className}
                {...props}
            />
        </Suspense>
    );
}
