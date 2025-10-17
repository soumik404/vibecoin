"use client";
import { useState, useEffect } from "react";

export type ToastType = "success" | "error";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number; // auto-hide duration in ms
}

export const Toast = ({ message, type = "success", duration = 7000 }: ToastProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  // Detect tx hash (0x...) in message and make it clickable
  const regex = /(0x[a-fA-F0-9]{6,64})/g;
  const parts = message.split(regex);

  return (
    <div className={`fixed bottom-5 right-5 max-w-sm p-4 rounded-lg shadow-lg text-white font-semibold ${bgColor} z-50`}>
      {parts.map((part, idx) => {
        if (part.match(regex)) {
          return (
            <a
              key={idx}
              href={`https://basescan.org/tx/${part}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-yellow-200"
            >
              {part}
            </a>
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </div>
  );
};