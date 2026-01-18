'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProjectForm from '@/components/projects/project-form';
import api from '@/lib/axios';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EditProjectPage() {
    const params = useParams();
    const id = params.id;
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await api.get(`/projects/find/${id}`);
                setProject(res.data.data || res.data);
            } catch (error) {
                console.error(error);
                // Axios interceptor will handle 404/errors
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProject();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
            </div>
        );
    }

    if (!project) {
        return <div>Project not found</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6">Edit Project</h1>
            <ProjectForm initialData={project} />
        </motion.div>
    );
}
