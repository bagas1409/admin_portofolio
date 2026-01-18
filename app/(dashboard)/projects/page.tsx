'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/modal';

interface Project {
    _id: string;
    title: string;
    type: 'MOBILE' | 'WEB';
    images: string[];
    description: string;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'mobile' | 'web'>('ALL');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            // Adjust based on Backend Response wrapper
            // Often res.data.data is the array
            setProjects(Array.isArray(res.data) ? res.data : (res.data.data || []));
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(p => {
        if (filter === 'ALL') return true;
        return p.type === filter;
    });

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await api.delete(`/projects/${deleteId}`);
            toast.success('Project deleted successfully');
            setProjects(projects.filter(p => p._id !== deleteId));
            setDeleteId(null);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-8">
            {/* Actions Toolbar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                {/* Filters */}
                <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-xl border border-gray-200/50">
                    {(['ALL', 'mobile', 'web'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-white text-[var(--color-primary)] shadow-sm font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {f === 'ALL' ? 'All' : f === 'mobile' ? 'Mobile' : 'Web'}
                        </button>
                    ))}
                </div>

                <Link
                    href="/projects/create"
                    className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95 text-sm"
                >
                    <Plus size={18} />
                    Add New Project
                </Link>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No projects found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <motion.div
                            key={project._id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="aspect-video relative overflow-hidden bg-gray-100">
                                {project.images && project.images.length > 0 ? (
                                    <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${project.type === 'mobile' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                        {project.type}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{project.title}</h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">{project.description}</p>

                                <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                                    <Link
                                        href={`/projects/${project._id}/edit`}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                                    >
                                        <Edit size={16} /> Edit
                                    </Link>
                                    <button
                                        onClick={() => setDeleteId(project._id)}
                                        className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Project?">
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this project? This action cannot be undone.
                </p>
                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={() => setDeleteId(null)}
                        className="px-4 py-2 rounded-lg text-gray-600 font-medium hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </Modal>
        </div>
    );
}
