import { LayoutDashboard, Wallet, PiggyBank, Receipt, BarChart3, Settings, X } from 'lucide-react';
import { cn } from '../../utils/cn.js';

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '#', badge: null },
    { label: 'Accounts', icon: Wallet, href: '#', badge: '4' },
    { label: 'Budgets', icon: PiggyBank, href: '#', badge: null },
    { label: 'Transactions', icon: Receipt, href: '#', badge: '12' },
    { label: 'Reports', icon: BarChart3, href: '#', badge: null },
    { label: 'Settings', icon: Settings, href: '#', badge: null },
];

const Sidebar = ({ isOpen, onClose, activeItem = 'Dashboard' }) => {
    return (
        <>
            <div
                className={cn(
                    'fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-sm transition-opacity md:hidden',
                    isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
                onClick={onClose}
            />
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-surface px-6 py-8 shadow-card transition-transform duration-300 ease-in-out dark:bg-surface-dark md:static md:w-64 md:translate-x-0 md:shadow-none',
                    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
                )}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-widest text-primary-500">Trackit</span>
                        <h1 className="mt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-50">Finance Hub</h1>
                    </div>
                    <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-muted text-neutral-500 transition hover:text-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:bg-surface-dark-muted dark:text-neutral-300 md:hidden"
                        onClick={onClose}
                        aria-label="Close sidebar"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <nav className="mt-10 flex flex-1 flex-col gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeItem === item.label;
                        return (
                            <a
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    'group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary-50/80 text-primary-600 dark:bg-neutral-800/70 dark:text-neutral-100'
                                        : 'text-neutral-500 hover:bg-primary-50/60 hover:text-primary-600 dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-100',
                                )}
                            >
                                <span className="flex items-center gap-3">
                                    <span
                                        className={cn(
                                            'flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600 transition-colors dark:bg-neutral-800/80 dark:text-neutral-100',
                                            isActive && 'bg-primary-500 text-white dark:bg-primary-500',
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    {item.label}
                                </span>
                                {item.badge ? (
                                    <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-600 dark:bg-neutral-800/70 dark:text-neutral-200">
                                        {item.badge}
                                    </span>
                                ) : null}
                            </a>
                        );
                    })}
                </nav>

                <div className="mt-auto rounded-xl bg-primary-50/70 p-5 text-sm dark:bg-neutral-800/70">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-neutral-200">Need insights?</p>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                        Upgrade to unlock AI-powered forecasting and automated savings plans.
                    </p>
                    <button
                        type="button"
                        className="mt-4 w-full rounded-lg bg-primary-500 py-2 text-sm font-semibold text-white transition hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    >
                        Upgrade plan
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
