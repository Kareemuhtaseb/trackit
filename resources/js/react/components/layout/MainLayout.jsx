import { useState } from 'react';
import { useDarkMode } from '../../hooks/useDarkMode.js';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';

const MainLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { isDark, toggle } = useDarkMode();

    return (
        <div className="flex min-h-screen bg-neutral-50 text-neutral-900 transition-colors dark:bg-neutral-900 dark:text-neutral-100">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                activeItem="Dashboard"
            />
            <div className="flex flex-1 flex-col">
                <Navbar
                    onMenuClick={() => setIsSidebarOpen(true)}
                    isDarkMode={isDark}
                    onToggleTheme={toggle}
                />
                <main className="flex-1 px-4 pb-10 pt-6 sm:px-6 lg:px-10">{children}</main>
            </div>
        </div>
    );
};

export default MainLayout;
