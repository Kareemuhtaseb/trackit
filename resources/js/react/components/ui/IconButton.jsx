import { cn } from '../../utils/cn.js';

const IconButton = ({ children, className = '', ...props }) => (
    <button
        type="button"
        className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-neutral-500 transition-colors hover:text-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:bg-surface-dark-muted dark:text-neutral-300',
            className,
        )}
        {...props}
    >
        {children}
    </button>
);

export default IconButton;
