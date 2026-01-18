'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/dashboard/sidebar';
import { Loader2, Menu, LogOut, User, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.replace('/login');
        } else {
            setAuthorized(true);
        }
    }, [router]);

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
        toast.success('Logged out');
        router.push('/login');
    };

    const getPageTitle = (path: string | null) => {
        if (!path) return 'Admin Panel';
        if (path === '/') return 'Dashboard';
        if (path.startsWith('/projects/create')) return 'Create Project';
        if (path.startsWith('/projects') && path !== '/projects') return 'Edit Project';
        if (path === '/projects') return 'Projects';
        return 'Admin Panel';
    };

    if (!authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
                <Loader2 className="animate-spin text-[var(--color-primary)]" size={32} />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[var(--color-bg)] font-sans text-slate-900">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative transition-all duration-300">
                {/* Modern Header */}
                {/* Modern Header */}
                <header className="h-20 bg-white/70 backdrop-blur-2xl border-b border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.02)] flex items-center justify-between px-6 z-30 shrink-0 sticky top-0 transition-all duration-300">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 text-gray-500 hover:bg-white hover:shadow-md rounded-xl transition-all"
                        >
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">{getPageTitle(pathname)}</h1>
                            <p className="text-xs text-slate-500 hidden md:block">Manage your portfolio content</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notifications (Mock) */}
                        <div className="relative cursor-pointer text-gray-400 hover:text-[var(--color-primary)] transition-colors p-2 hidden sm:block">
                            <Bell size={20} />
                            <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </div>

                        {/* Divider */}
                        <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

                        {/* Profile Section */}
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-gray-900">Admin User</p>
                                <p className="text-xs text-gray-500">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-indigo-400 p-0.5 shadow-lg shadow-indigo-500/20">
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                    <User size={20} className="text-[var(--color-primary)]" />
                                </div>
                            </div>
                        </div>

                        {/* Logout Button (Directly Visible) */}
                        <button
                            onClick={handleLogout}
                            className="ml-2 p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-100"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
