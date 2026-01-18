'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Loader2, Save } from 'lucide-react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/ui/image-upload';
import { cn } from '@/lib/utils';

interface ProjectFormProps {
    initialData?: any;
}

// Helper to decode HTML entities (Fix for corrupted data)
const decodeHtmlEntity = (str: string) => {
    if (!str) return str;
    return str.replace(/&#x2F;/g, '/')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
};

export default function ProjectForm({ initialData }: ProjectFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: 'web',
        description: '',
        features: [''],
        techStack: [''],
        image: '',
        videoUrl: '',
        downloadUrl: '',
        liveUrl: '',
        status: 'draft',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                type: initialData.type || 'web',
                description: initialData.description || '',
                features: initialData.features?.length ? initialData.features : [''],
                techStack: initialData.techStack?.length ? initialData.techStack : [''],
                // Decode image URL just in case
                image: initialData.images?.[0] ? decodeHtmlEntity(initialData.images[0]) : '',
                videoUrl: initialData.videoUrl ? decodeHtmlEntity(initialData.videoUrl) : '',
                downloadUrl: initialData.downloadUrl || '',
                liveUrl: initialData.liveUrl || '',
                status: initialData.status || 'draft',
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleArrayChange = (index: number, value: string, field: 'features' | 'techStack') => {
        // @ts-ignore
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData({ ...formData, [field]: newArray });
    };

    const addArrayItem = (field: 'features' | 'techStack') => {
        // @ts-ignore
        setFormData({ ...formData, [field]: [...formData[field], ''] });
    };

    const removeArrayItem = (index: number, field: 'features' | 'techStack') => {
        // @ts-ignore
        const newArray = [...formData[field]];
        newArray.splice(index, 1);
        setFormData({ ...formData, [field]: newArray });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Clean up empty array items
        const cleanData = {
            ...formData,
            features: formData.features.filter(f => f.trim() !== ''),
            techStack: formData.techStack.filter(t => t.trim() !== ''),
            images: formData.image ? [formData.image] : [],
        };

        try {
            if (initialData) {
                await api.put(`/projects/${initialData._id}`, cleanData);
                toast.success('Project updated successfully');
            } else {
                await api.post('/projects', cleanData);
                toast.success('Project created successfully');
            }
            router.push('/projects');
            router.refresh();
        } catch (error: any) {
            console.error("Submission Error:", error);
            const msg = error.response?.data?.message || "Something went wrong";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                            placeholder="Project Title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <div className="flex gap-4">
                            {(['web', 'mobile'] as const).map(type => (
                                <button
                                    type="button"
                                    key={type}
                                    onClick={() => setFormData({ ...formData, type })}
                                    className={cn(
                                        "flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-all",
                                        formData.type === type
                                            ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                                    )}
                                >
                                    {type === 'mobile' ? 'Mobile App' : 'Web App'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all resize-none"
                            placeholder="Project description..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                        <ImageUpload
                            value={formData.image}
                            onChange={(url) => setFormData({ ...formData, image: url })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Video URL</label>
                        <input
                            name="videoUrl"
                            value={formData.videoUrl}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                            placeholder="https://youtube.com/..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Download URL</label>
                        <input
                            name="downloadUrl"
                            value={formData.downloadUrl}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                            placeholder="https://drive.google.com/..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">View Project URL</label>
                        <input
                            name="liveUrl"
                            value={formData.liveUrl}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
                            placeholder="https://website.com/..."
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Tech Stack */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tech Stack</label>
                    <div className="space-y-2">
                        {formData.techStack.map((tech, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    value={tech}
                                    onChange={(e) => handleArrayChange(index, e.target.value, 'techStack')}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
                                    placeholder={`Tech ${index + 1}`}
                                />
                                {formData.techStack.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem(index, 'techStack')}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayItem('techStack')}
                            className="text-sm text-[var(--color-primary)] font-medium hover:underline flex items-center gap-1 cursor-pointer"
                        >
                            <Plus size={16} /> Add Tech
                        </button>
                    </div>
                </div>

                {/* Features */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                    <div className="space-y-2">
                        {formData.features.map((feature, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    value={feature}
                                    onChange={(e) => handleArrayChange(index, e.target.value, 'features')}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
                                    placeholder={`Feature ${index + 1}`}
                                />
                                {formData.features.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem(index, 'features')}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayItem('features')}
                            className="text-sm text-[var(--color-primary)] font-medium hover:underline flex items-center gap-1 cursor-pointer"
                        >
                            <Plus size={16} /> Add Feature
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-[var(--color-primary)] text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 min-w-[140px] justify-center cursor-pointer"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Project</>}
                </button>
            </div>
        </form>
    );
}
