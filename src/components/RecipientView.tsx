"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LoveRequest } from "@/types";
import { THEMES, NO_MESSAGES } from "@/types";
import FloatingHearts from "./FloatingHearts";

interface Props {
  request: LoveRequest;
}

export default function RecipientView({ request }: Props) {
  const [noClicks, setNoClicks] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const [message, setMessage] = useState("");
  const [confetti, setConfetti] = useState<
    { id: number; left: number; color: string; delay: number; size: number }[]
  >([]);

  const theme = THEMES[request.theme] || THEMES["pink-romance"];
  const isDark = request.theme === "red-velvet";

  // Progressive scale: starts at 1, grows up to ~2.2
  const yesScale = Math.min(1 + noClicks * 0.18, 2.2);
  const yesFontSize = Math.min(1 + noClicks * 0.08, 1.6);
  const yesPadding = Math.min(1 + noClicks * 0.1, 1.8);

  const handleNo = useCallback(() => {
    const next = noClicks + 1;
    setNoClicks(next);
    setMessage(NO_MESSAGES[Math.min(next - 1, NO_MESSAGES.length - 1)]);

    // Track
    fetch(`/api/love/${request.id}/no`, { method: "POST" }).catch(() => {});
  }, [noClicks, request.id]);

  const handleYes = useCallback(() => {
    setAccepted(true);
    // Generate confetti
    const colors = ["#ec4899", "#f43f5e", "#fbbf24", "#a855f7", "#fb7185", "#f97316"];
    const items = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      size: 6 + Math.random() * 10,
    }));
    setConfetti(items);

    fetch(`/api/love/${request.id}/yes`, { method: "POST" }).catch(() => {});
  }, [request.id]);

  const restart = () => {
    setAccepted(false);
    setNoClicks(0);
    setMessage("");
    setShowExtra(false);
    setConfetti([]);
  };

  // Clear message after a while
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(t);
  }, [message]);

  if (accepted) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${theme.bg} relative overflow-hidden flex items-center justify-center p-4`}
      >
        <FloatingHearts count={20} />
        {/* Confetti */}
        {confetti.map((c) => (
          <div
            key={c.id}
            className="confetti"
            style={{
              left: `${c.left}%`,
              backgroundColor: c.color,
              width: c.size,
              height: c.size,
              animationDuration: `${2 + Math.random() * 2}s`,
              animationDelay: `${c.delay}s`,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            }}
          />
        ))}

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className={`relative z-10 max-w-md w-full love-3xl p-6 sm:p-8 text-center space-y-5 ${theme.card} border love-card`}
        >
          {request.happy_gif_url && (
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={request.happy_gif_url}
                alt="Happy celebration"
                className="max-h-40 sm:max-h-48 rounded-2xl object-contain"
              />
            </div>
          )}

          <h2 className={`text-2xl sm:text-3xl font-bold ${theme.text}`}>
            واااای، بله گفتیییی! 😭❤️
          </h2>

          {request.yes_message && (
            <motion.div
              initial={{ rotateX: 90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className={`p-4 rounded-2xl ${
                isDark ? "bg-red-900/40" : "bg-pink-50"
              } border ${isDark ? "border-red-700" : "border-pink-100"}`}
            >
              <p className={`text-base leading-relaxed ${theme.text}`} dir="auto">
                {request.yes_message}
              </p>
            </motion.div>
          )}

          {request.final_message && !showExtra && (
            <button
              onClick={() => setShowExtra(true)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium ${theme.buttonYes} text-white shadow-md`}
            >
              یه پیام دیگه برام داری؟ 💌
            </button>
          )}

          <AnimatePresence>
            {showExtra && request.final_message && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className={`text-sm ${theme.text} opacity-90`}
                dir="auto"
              >
                {request.final_message}
              </motion.p>
            )}
          </AnimatePresence>

          {request.sender_name && (
            <p className={`text-xs opacity-60 ${theme.text}`}>
              از طرف {request.sender_name} 💕
            </p>
          )}

          <button
            onClick={restart}
            className={`mt-2 text-sm underline opacity-70 hover:opacity-100 ${theme.text}`}
          >
            دوباره از اول ببینیم؟ 💞
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.bg} relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6`}
    >
      <FloatingHearts count={12} />

      <div
        className={`relative z-10 max-w-md w-full rounded-3xl p-5 sm:p-8 text-center space-y-4 ${theme.card} border love-card`}
      >
        {/* Sad GIF */}
        {request.sad_gif_url && (
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={request.sad_gif_url}
              alt="Pleading"
              className="max-h-36 sm:max-h-44 rounded-2xl object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        {/* Title */}
        <h1 className={`text-xl sm:text-2xl font-bold ${theme.text}`} dir="auto">
          {request.title}
        </h1>

        {/* Question */}
        <p
          className={`text-lg sm:text-xl leading-relaxed ${theme.text} font-medium`}
          dir="auto"
        >
          {request.question}
        </p>

        {/* Subtitle */}
        {request.subtitle && (
          <p className={`text-sm opacity-80 ${theme.text}`} dir="auto">
            {request.subtitle}
          </p>
        )}

        {/* Playful message after NO */}
        <AnimatePresence mode="wait">
          {message && (
            <motion.p
              key={message}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-sm font-medium ${isDark ? "text-rose-300" : "text-rose-500"}`}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 min-h-[80px]">
          <button
            onClick={handleYes}
            className={`yes-btn rounded-full font-bold text-white shadow-lg ${theme.buttonYes}`}
            style={{
              transform: `scale(${yesScale})`,
              fontSize: `${yesFontSize}rem`,
              padding: `${0.75 * yesPadding}rem ${1.5 * yesPadding}rem`,
              zIndex: 10,
            }}
          >
            {request.yes_button_text}
          </button>

          <button
            onClick={handleNo}
            className={`rounded-full font-medium px-5 py-2.5 transition-all ${theme.buttonNo}`}
            style={{
              transform: `scale(${Math.max(0.85, 1 - noClicks * 0.03)})`,
              opacity: Math.max(0.6, 1 - noClicks * 0.05),
            }}
          >
            {request.no_button_text}
          </button>
        </div>

        {request.sender_name && (
          <p className={`text-xs opacity-50 pt-2 ${theme.text}`}>
            از طرف {request.sender_name}
          </p>
        )}
      </div>

      <p className="relative z-10 text-center text-xs opacity-40 mt-6">
        Made with love ❤️
      </p>
    </div>
  );
}
