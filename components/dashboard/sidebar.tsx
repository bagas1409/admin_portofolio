'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, FolderKanban, LogOut, X, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Mail, label: 'Inbox', href: '/messages' },
    { icon: FolderKanban, label: 'Projects', href: '/projects' },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
        toast.success('Logged out successfully');
        router.push('/login');
    };

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-screen w-64 bg-white/80 backdrop-blur-xl border-r border-indigo-50/50 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] md:shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-indigo-50/50 bg-gradient-to-br from-white/50 to-indigo-50/30">
                    <span className="text-xl font-bold tracking-tight text-[var(--color-text)] drop-shadow-sm">
                        Admin<span className="text-[var(--color-primary)]">.Panel</span>
                    </span>
                    <button onClick={onClose} className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => onClose()} // Close on mobile navigation
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group overflow-hidden font-medium duration-300",
                                    isActive
                                        ? "text-white bg-gradient-to-r from-[var(--color-primary)] to-indigo-600 shadow-[0_4px_12px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_16px_rgba(79,70,229,0.4)] translate-x-1"
                                        : "text-slate-500 hover:bg-white hover:text-[var(--color-primary)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:translate-x-1"
                                )}
                            >
                                <item.icon size={20} className={cn(isActive ? "text-white" : "text-gray-400 group-hover:text-[var(--color-primary)]")} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

            </aside>
        </>
    );
}
