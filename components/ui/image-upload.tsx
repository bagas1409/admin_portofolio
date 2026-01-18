'use client';

import { useState, useRef } from 'react';
import Image from "next/image";
import { motion } from 'framer-motion';
import { Upload, X, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    disabled?: boolean;
}

export default function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await api.post('/upload/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const url = res.data.url || res.data.data?.url || res.data.secure_url;
            if (url) {
                onChange(url);
                toast.success('Image uploaded successfully');
            } else {
                console.error("No URL in response", res.data);
                // If the backend returns just the string path? 
                if (typeof res.data === 'string') {
                    onChange(res.data);
                    toast.success('Image uploaded successfully');
                } else {
                    toast.error("Upload failed: No URL returned");
                }
            }
        } catch (error) {
            console.error('Upload Error', error);
        } finally {
            setLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = () => {
        onChange('');
    };

    return (
        <div className="space-y-4">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                disabled={disabled || loading}
            />

            {value ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-video w-full max-w-md rounded-xl overflow-hidden border border-gray-200 bg-gray-100"
                >
                    <Image src={value} alt="Upload" fill className="object-cover" sizes="(max-width: 768px) 100vw, 500px" />
                    <button
                        onClick={handleRemove}
                        type="button"
                        disabled={disabled}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </motion.div>
            ) : (
                <div
                    onClick={() => !loading && fileInputRef.current?.click()}
                    className={cn(
                        "border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[var(--color-primary)] hover:bg-[var(--color-surface)] transition-all h-64 bg-gray-50",
                        (disabled || loading) && "opacity-50 cursor-not-allowed hover:bg-gray-50 hover:border-gray-300"
                    )}
                >
                    {loading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
                            <span className="text-sm text-gray-500">Uploading...</span>
                        </div>
                    ) : (
                        <>
                            <div className="p-4 bg-white rounded-full mb-4 shadow-sm">
                                <Upload className="text-[var(--color-primary)]" size={32} />
                            </div>
                            <p className="text-sm font-medium text-gray-700">Click to upload image</p>
                            <p className="text-xs text-gray-500 mt-2">JPG, PNG, WEBP</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
