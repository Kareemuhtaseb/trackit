import { cn } from '../../utils/cn.js';

const Card = ({ children, className = '', padding = 'p-6', ...props }) => {
    return (
        <div
            className={cn(
                'rounded-xl bg-surface shadow-card ring-1 ring-neutral-100/80 transition-colors dark:bg-surface-dark dark:ring-neutral-900/60',
                padding,
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
