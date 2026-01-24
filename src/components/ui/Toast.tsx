"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa";

export interface ToastProps {
    message: string;
    type?: "success" | "error" | "info";
    duration?: number;
    onClose?: () => void;
}

export function Toast({ message, type = "success", duration = 5000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
    };

    const colors = {
        success: "border-[#4ADE80] bg-[#4ADE80]/10 text-[#4ADE80]",
        error: "border-red-500 bg-red-500/10 text-red-500",
        info: "border-blue-500 bg-blue-500/10 text-blue-500",
    };

    const icons = {
        success: <FaCheck className="text-sm" />,
        error: <FaTimes className="text-sm" />,
        info: <FaTimes className="text-sm" />,
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, y: 50, x: "-50%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`fixed bottom-6 left-1/2 z-50 px-6 py-4 rounded-lg border shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md ${colors[type]}`}
                >
                    <div className="flex-shrink-0">
                        {icons[type]}
                    </div>
                    <p className="text-sm font-medium flex-1">{message}</p>
                    <button
                        onClick={handleClose}
                        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                    >
                        <FaTimes className="text-sm" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function ToastContainer({ toasts, removeToast }: { toasts: Array<{ id: string } & ToastProps>, removeToast: (id: string) => void }) {
    return (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        layout
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <Toast
                            {...toast}
                            onClose={() => removeToast(toast.id)}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
