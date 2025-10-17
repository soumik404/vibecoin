"use client";
import { useState, useEffect } from "react";
import { Toast, ToastType } from "./toast";

let showToastCallback: ((message: string, type?: ToastType) => void) | null = null;

export const ToastContainer = () => {
  const [toast, setToast] = useState<{ message: string; type?: ToastType } | null>(null);

  useEffect(() => {
    showToastCallback = (message, type) => setToast({ message, type });
  }, []);

  if (!toast) return null;

  return <Toast message={toast.message} type={toast.type} />;
};

// Global function to call toast anywhere
export const showToast = (message: string, type?: ToastType) => {
  if (showToastCallback) showToastCallback(message, type);
};
