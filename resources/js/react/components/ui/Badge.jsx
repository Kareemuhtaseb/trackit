import { cn } from '../../utils/cn.js';

const variantClasses = {
    default:
        'bg-neutral-100 text-neutral-700 dark:bg-neutral-700/40 dark:text-neutral-100 border border-neutral-200/70 dark:border-neutral-700/70',
    success:
        'bg-success-100 text-success-700 border border-success-200/70 dark:bg-success-700/30 dark:text-success-100 dark:border-success-600/40',
    warning:
        'bg-warning-100 text-warning-700 border border-warning-200/70 dark:bg-warning-700/30 dark:text-warning-100 dark:border-warning-600/40',
    danger:
        'bg-danger-100 text-danger-700 border border-danger-200/70 dark:bg-danger-700/30 dark:text-danger-100 dark:border-danger-600/40',
};

const Badge = ({ children, className = '', variant = 'default', ...props }) => (
    <span
        className={cn(
            'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
            variantClasses[variant],
            className,
        )}
        {...props}
    >
        {children}
    </span>
);

export default Badge;
