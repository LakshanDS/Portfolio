"use client";

import { useState } from "react";
import { FaPaperPlane, FaComment } from "react-icons/fa";
import { ToastContainer } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";

interface ToastItem {
    id: string;
    message: string;
    type?: "success" | "error" | "info";
    duration?: number;
}

interface CommentsSectionProps {
    projectId: string;
}

export function CommentsSection({ projectId }: CommentsSectionProps) {
    const [submitting, setSubmitting] = useState(false);
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        content: ""
    });

    const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.content.trim()) {
            addToast("Please enter a comment", "error");
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch("/api/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    projectId,
                    name: formData.name || undefined,
                    email: formData.email || undefined,
                    content: formData.content,
                }),
            });

            if (response.ok) {
                setFormData({ name: "", email: "", content: "" });
                addToast("Thank you for your comment!", "success");
            } else {
                addToast("Failed to submit comment. Please try again.", "error");
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
            addToast("Failed to submit comment. Please try again.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <div className="mt-12 pt-8 border-t border-[#1F2937]">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#4ADE80]/10 border border-[#4ADE80]/20">
                                <FaComment className="text-[#4ADE80] text-sm" />
                            </div>
                            <h2 className="text-xl font-bold text-[#E6EDF3]">Leave a suggestion to improve!</h2>
                        </div>
                        <p className="text-[#9CA3AF] text-xs">Share your thoughts about this project</p>
                    </div>

                    {/* Form Container */}
                    <div className="bg-[#111827]/50 border border-[#1F2937] rounded-xl p-5 shadow-lg backdrop-blur-sm">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
                                {/* Left Column - Name & Email */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-[#E6EDF3] mb-1.5">
                                            Name <span className="text-[#6B7280] font-normal">(optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Your name"
                                            className="w-full bg-[#0D1117] border border-[#1F2937] rounded-lg px-3 py-2.5 text-[#E6EDF3] placeholder-[#6B7280] focus:outline-none focus:border-[#4ADE80] focus:ring-1 focus:ring-[#4ADE80]/20 transition-all text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[#E6EDF3] mb-1.5">
                                            Email <span className="text-[#6B7280] font-normal">(optional)</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="your@email.com"
                                            className="w-full bg-[#0D1117] border border-[#1F2937] rounded-lg px-3 py-2.5 text-[#E6EDF3] placeholder-[#6B7280] focus:outline-none focus:border-[#4ADE80] focus:ring-1 focus:ring-[#4ADE80]/20 transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Right Column - Comment */}
                                <div className="flex flex-col h-full">
                                    <label className="block text-xs font-medium text-[#E6EDF3] mb-1.5">
                                        Comment <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="Share your thoughts about this project..."
                                        rows={3}
                                        required
                                        className="w-full flex-1 bg-[#0D1117] border border-[#1F2937] rounded-lg px-3 py-2.5 text-[#E6EDF3] placeholder-[#6B7280] focus:outline-none focus:border-[#4ADE80] focus:ring-1 focus:ring-[#4ADE80]/20 transition-all resize-none text-sm"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    isLoading={submitting}
                                    variant="primary"
                                    className="w-full justify-center shadow-none hover:shadow-none"
                                >
                                    <FaPaperPlane className="text-sm" />
                                    Post Comment
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
