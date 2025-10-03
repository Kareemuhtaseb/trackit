import { Moon, Sun } from 'lucide-react';
import { cn } from '../../utils/cn.js';

const DarkModeToggle = ({ isDark = false, onToggle, className = '' }) => (
    <button
        type="button"
        onClick={onToggle}
        className={cn(
            'relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-surface-muted text-neutral-500 transition hover:text-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:bg-surface-dark-muted dark:text-neutral-300',
            className,
        )}
        aria-label={isDark ? 'Activate light mode' : 'Activate dark mode'}
    >
        <Sun className={cn('h-5 w-5 transition-transform duration-300', isDark && 'translate-y-6 opacity-0')} />
        <Moon className={cn('absolute h-5 w-5 transition-transform duration-300', isDark ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0')} />
    </button>
);

export default DarkModeToggle;
