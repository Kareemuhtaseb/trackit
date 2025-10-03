import { useEffect, useRef, useState } from 'react';
import { Bell, ChevronDown, LogOut, Menu, Settings, User } from 'lucide-react';
import IconButton from '../ui/IconButton.jsx';
import SearchInput from '../ui/SearchInput.jsx';
import DarkModeToggle from '../ui/DarkModeToggle.jsx';

const Navbar = ({ onMenuClick, isDarkMode, onToggleTheme }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200/60 bg-surface/90 px-4 py-4 backdrop-blur dark:border-neutral-800 dark:bg-surface-dark/70 sm:px-6">
            <div className="flex flex-1 items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200/60 bg-surface text-neutral-500 transition hover:border-primary-200 hover:text-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:border-neutral-800 dark:bg-surface-dark dark:text-neutral-300 md:hidden"
                    aria-label="Open sidebar"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <div className="hidden max-w-sm flex-1 md:block">
                    <SearchInput />
                </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-40 md:hidden">
                    <SearchInput />
                </div>
                <IconButton aria-label="View notifications">
                    <div className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -right-1 -top-1 inline-flex h-2.5 w-2.5 rounded-full bg-danger-500" />
                    </div>
                </IconButton>
                <DarkModeToggle isDark={isDarkMode} onToggle={onToggleTheme} />
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsProfileOpen((prev) => !prev)}
                        className="flex items-center gap-2 rounded-full border border-transparent bg-surface-muted px-2 py-1 pl-1 pr-3 text-left text-sm font-medium text-neutral-600 transition hover:text-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:bg-surface-dark-muted dark:text-neutral-200"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-sm font-semibold text-white">KA</span>
                        <span className="hidden flex-col leading-tight sm:flex">
                            <span className="text-xs text-neutral-400 dark:text-neutral-500">Finance Manager</span>
                            <span>Kareem Ahmed</span>
                        </span>
                        <ChevronDown className="h-4 w-4 text-neutral-400 transition duration-300" />
                    </button>
                    {isProfileOpen ? (
                        <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border border-neutral-200/70 bg-surface shadow-lg ring-1 ring-black/5 dark:border-neutral-700 dark:bg-surface-dark">
                            <div className="border-b border-neutral-200/70 bg-surface-muted px-4 py-3 text-sm dark:border-neutral-700 dark:bg-surface-dark-muted">
                                <p className="font-semibold text-neutral-700 dark:text-neutral-100">Kareem Ahmed</p>
                                <p className="text-xs text-neutral-400 dark:text-neutral-500">kareem.finance@example.com</p>
                            </div>
                            <div className="py-2 text-sm text-neutral-600 dark:text-neutral-200">
                                <button className="flex w-full items-center gap-3 px-4 py-2 hover:bg-primary-50/80 hover:text-primary-600 dark:hover:bg-neutral-800/70" type="button">
                                    <User className="h-4 w-4" /> Profile
                                </button>
                                <button className="flex w-full items-center gap-3 px-4 py-2 hover:bg-primary-50/80 hover:text-primary-600 dark:hover:bg-neutral-800/70" type="button">
                                    <Settings className="h-4 w-4" /> Settings
                                </button>
                                <button className="flex w-full items-center gap-3 px-4 py-2 text-danger-600 hover:bg-danger-50/80 hover:text-danger-600 dark:text-danger-300 dark:hover:bg-danger-700/30" type="button">
                                    <LogOut className="h-4 w-4" /> Sign out
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
