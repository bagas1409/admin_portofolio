'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Mail, Clock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface Message {
    _id: string;
    sender: {
        username: string;
        email: string;
    };
    content: string;
    isRead: boolean;
    createdAt: string;
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        try {
            const res = await api.get('/messages');
            setMessages(res.data.data);
        } catch (error) {
            console.error('Failed to fetch messages', error);
            toast.error('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await api.put(`/messages/${id}`);
            // Update local state
            setMessages(messages.map(m => m._id === id ? { ...m, isRead: true } : m));
            toast.success('Marked as read');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    if (loading) return <div className="p-8">Loading messages...</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Mail className="text-indigo-600" /> Inbox
                </h1>
            </div>

            {messages.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-300 text-center text-gray-400">
                    <Mail className="mx-auto w-12 h-12 mb-4 opacity-50" />
                    <p>No messages found.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {messages.map((msg, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={msg._id}
                            className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${msg.isRead
                                ? 'bg-white border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]'
                                : 'bg-white border-blue-100 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.15)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.2)] border-l-4 border-l-blue-500'
                                }`}
                        >
                            <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                                <div className="space-y-2 flex-grow">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold uppercase">
                                            {msg.sender?.username?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">
                                                {msg.sender?.username || 'Unknown User'}
                                            </h3>
                                            <p className="text-xs text-slate-500">{msg.sender?.email}</p>
                                        </div>
                                        {!msg.isRead && (
                                            <span className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ml-2">
                                                New
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-slate-700 whitespace-pre-wrap">
                                        {msg.content}
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <Clock size={12} />
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </div>
                                </div>

                                {!msg.isRead && (
                                    <button
                                        onClick={() => handleMarkAsRead(msg._id)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-slate-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors text-sm font-medium shadow-sm whitespace-nowrap"
                                    >
                                        <CheckCircle2 size={16} /> Mark as Read
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
