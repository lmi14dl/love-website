"use client";

import { useEffect } from "react";

export default function HeartCursor() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // skip on touch

    let last = 0;
    const handler = (e: MouseEvent) => {
      const now = Date.now();
      if (now - last < 80) return;
      last = now;

      const el = document.createElement("span");
      el.className = "heart-cursor";
      el.textContent = "💕";
      el.style.left = `${e.clientX - 8}px`;
      el.style.top = `${e.clientY - 8}px`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 800);
    };

    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return null;
}
