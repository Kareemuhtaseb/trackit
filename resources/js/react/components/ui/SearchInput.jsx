import { Search } from 'lucide-react';
import { cn } from '../../utils/cn.js';

const SearchInput = ({ className = '', ...props }) => (
    <div className={cn('relative flex items-center', className)}>
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-neutral-400 dark:text-neutral-500" />
        <input
            type="search"
            className="w-full rounded-lg border border-neutral-200/70 bg-surface-muted py-2 pl-10 pr-3 text-sm font-medium text-neutral-600 placeholder:text-neutral-400 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-neutral-800 dark:bg-surface-dark-muted dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-primary-500 dark:focus:ring-primary-500/30"
            placeholder="Search transactions..."
            {...props}
        />
    </div>
);

export default SearchInput;
