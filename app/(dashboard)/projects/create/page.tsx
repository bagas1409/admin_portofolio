'use client';

import ProjectForm from '@/components/projects/project-form';
import { motion } from 'framer-motion';

export default function CreateProjectPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h1 className="text-3xl font-bold text-[var(--color-text)] mb-6">Create New Project</h1>
            <ProjectForm />
        </motion.div>
    )
}
