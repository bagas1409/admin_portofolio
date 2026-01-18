'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/axios';
import { Loader2 } from 'lucide-react';
import StatsCharts from '@/components/dashboard/stats-charts';

export default function DashboardPage() {
    const [stats, setStats] = useState({ total: 0, mobile: 0, web: 0, messages: 0, unread: 0 });
    const [messagesList, setMessagesList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [projectsRes, messagesRes] = await Promise.all([
                    api.get('/projects'),
                    api.get('/messages')
                ]);

                const projectsData = Array.isArray(projectsRes.data) ? projectsRes.data : (projectsRes.data.data || []);
                const messagesData = messagesRes.data.data || [];

                const total = projectsData.length;
                const mobile = projectsData.filter((p: any) => p.type === 'mobile').length;
                const web = projectsData.filter((p: any) => p.type === 'web').length;

                const messageCount = messagesData.length;
                const unreadCount = messagesData.filter((m: any) => !m.isRead).length;

                setStats({ total, mobile, web, messages: messageCount, unread: unreadCount });
                setMessagesList(messagesData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {loading ? (
                    <div className="mt-8 flex items-center justify-center p-12">
                        <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                            <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 transition-all duration-300 hover:-translate-y-1">
                                <h3 className="text-gray-500 font-medium">Total Projects</h3>
                                <p className="text-4xl font-bold text-[var(--color-primary)] mt-2">{stats.total}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 transition-all duration-300 hover:-translate-y-1">
                                <h3 className="text-gray-500 font-medium">Mobile Apps</h3>
                                <p className="text-4xl font-bold text-blue-500 mt-2">{stats.mobile}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(249,115,22,0.3)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 transition-all duration-300 hover:-translate-y-1">
                                <h3 className="text-gray-500 font-medium">Web Apps</h3>
                                <p className="text-4xl font-bold text-orange-500 mt-2">{stats.web}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(99,102,241,0.3)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 transition-all duration-300 hover:-translate-y-1">
                                <h3 className="text-gray-500 font-medium">Messages</h3>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <p className="text-4xl font-bold text-indigo-500">{stats.messages}</p>
                                    {stats.unread > 0 && (
                                        <span className="text-sm font-medium text-red-500 bg-red-50 px-2 py-1 rounded-full animate-pulse">
                                            {stats.unread} new
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <StatsCharts stats={stats} messagesData={messagesList} />
                    </>
                )}
            </motion.div>
        </div>
    );
}
