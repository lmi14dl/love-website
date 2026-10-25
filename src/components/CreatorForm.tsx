"use client";

import { useState, useCallback } from "react";
import { THEMES, type ThemeId, type CreateLoveRequestInput } from "@/types";
import FloatingHearts from "./FloatingHearts";
import HeartCursor from "./HeartCursor";

const DEFAULTS = {
  title: "یه درخواست کوچولوی عاشقانه دارم 🥺❤️",
  question: "عشقم، میای امشب یه کم بیشتر مال هم باشیم و با هم وقت بگذرونیم؟ 🥹💗",
  subtitle: "قول می‌دم اگه قبول کنی، کلی خوشحالت کنم! 🐻💕",
  yes_message: "می‌دونستم دلت نمیاد منو رد کنیییی! 😭❤️ حالا بیا یه عالمه عشق دریافت کن! 🫂💗",
  yes_button_text: "آرههه، قبول! ❤️",
  no_button_text: "نه 🙈",
};

export default function CreatorForm() {
  const [form, setForm] = useState<CreateLoveRequestInput>({
    ...DEFAULTS,
    theme: "pink-romance",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    shareUrl: string;
    editToken: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const update = useCallback(
    (key: keyof CreateLoveRequestInput, value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim() || !form.question.trim()) {
      setError("عنوان و سوال اصلی الزامی هستند 💕");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/love", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا در ساخت لینک");
      setResult({ shareUrl: data.shareUrl, editToken: data.editToken });
    } catch (err) {
      setError(err instanceof Error ? err.message : "مشکلی پیش آمد 😢");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const input = document.createElement("input");
      input.value = result.shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const share = async () => {
    if (!result || !navigator.share) return;
    try {
      await navigator.share({
        title: form.title,
        text: "یه درخواست کوچولو برات دارم ❤️",
        url: result.shareUrl,
      });
    } catch {
      // user cancelled
    }
  };

  const theme = THEMES[form.theme || "pink-romance"];

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 relative">
        <FloatingHearts count={15} />
        <HeartCursor />
        <div className="relative z-10 max-w-lg mx-auto px-4 py-12">
          <div className="love-card bg-white/95 border border-pink-200 p-8 text-center space-y-6">
            <div className="text-5xl animate-bounce">💌</div>
            <h1 className="text-2xl font-bold text-pink-700">
              لینک اختصاصی‌ات آماده‌ست!
            </h1>
            <p className="text-pink-600 text-sm">
              این لینک رو برای عشقت بفرست و منتظر جواب قشنگش باش 💕
            </p>

            <div className="bg-pink-50 rounded-xl p-4 break-all text-sm font-mono text-pink-800 border border-pink-200">
              {result.shareUrl}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={copyLink}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium shadow-lg hover:shadow-xl transition-all"
              >
                {copied ? "کپی شد! ✅" : "کپی لینک 📋"}
              </button>
              {typeof navigator !== "undefined" && "share" in navigator && (
                <button
                  onClick={share}
                  className="px-6 py-3 rounded-full bg-white border-2 border-pink-300 text-pink-600 font-medium hover:bg-pink-50 transition-all"
                >
                  اشتراک‌گذاری 📤
                </button>
              )}
            </div>

            <div className="pt-4 border-t border-pink-100">
              <p className="text-xs text-pink-400 mb-2">QR Code</p>
              <div className="flex justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(result.shareUrl)}`}
                  alt="QR Code"
                  width={150}
                  height={150}
                  className="rounded-lg border border-pink-200"
                />
              </div>
            </div>

            <a
              href={result.shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-pink-500 underline text-sm hover:text-pink-700"
            >
              پیش‌نمایش لینک ←
            </a>

            <button
              onClick={() => {
                setResult(null);
                setForm({ ...DEFAULTS, theme: "pink-romance" });
              }}
              className="text-sm text-pink-400 hover:text-pink-600 mt-4"
            >
              ساخت درخواست جدید
            </button>
          </div>
          <p className="text-center text-pink-300 text-xs mt-8">
            Made with love ❤️
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-cream-100 relative">
      <FloatingHearts count={10} />
      <HeartCursor />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-pink-700 mb-2">
            One Little Question ❤️
          </h1>
          <p className="text-pink-500 text-sm sm:text-base">
            یه درخواست کوچولوی عاشقانه بساز و براش بفرست
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="love-card bg-white/90 border border-pink-200 p-6 sm:p-8 space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1.5">
              عنوان درخواست
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              maxLength={100}
              className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition bg-white/80"
              placeholder="یه درخواست کوچولوی عاشقانه دارم 🥺❤️"
              dir="auto"
            />
          </div>

          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1.5">
              سوال اصلی <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={form.question}
              onChange={(e) => update("question", e.target.value)}
              maxLength={500}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition bg-white/80 resize-none"
              placeholder="عشقم، میای امشب..."
              dir="auto"
              required
            />
            <p className="text-xs text-pink-400 mt-1 text-left" dir="ltr">
              {form.question?.length || 0}/500
            </p>
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1.5">
              زیرنویس (اختیاری)
            </label>
            <input
              type="text"
              value={form.subtitle || ""}
              onChange={(e) => update("subtitle", e.target.value)}
              maxLength={150}
              className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition bg-white/80"
              placeholder="قول می‌دم اگه قبول کنی..."
              dir="auto"
            />
          </div>

          {/* GIFs */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-1.5">
                GIF غمگین / التماسی 🥺
              </label>
              <input
                type="url"
                value={form.sad_gif_url || ""}
                onChange={(e) => update("sad_gif_url", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition bg-white/80 text-sm"
                placeholder="https://...gif"
                dir="ltr"
              />
              {form.sad_gif_url && (
                <div className="mt-2 rounded-lg overflow-hidden border border-pink-100 max-h-32 flex items-center justify-center bg-pink-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.sad_gif_url}
                    alt="Sad GIF preview"
                    className="max-h-28 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-1.5">
                GIF شاد بعد از بله 🎉
              </label>
              <input
                type="url"
                value={form.happy_gif_url || ""}
                onChange={(e) => update("happy_gif_url", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition bg-white/80 text-sm"
                placeholder="https://...gif"
                dir="ltr"
              />
              {form.happy_gif_url && (
                <div className="mt-2 rounded-lg overflow-hidden border border-pink-100 max-h-32 flex items-center justify-center bg-pink-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.happy_gif_url}
                    alt="Happy GIF preview"
                    className="max-h-28 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Yes message */}
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1.5">
              پیام بعد از قبول (اختیاری)
            </label>
            <textarea
              value={form.yes_message || ""}
              onChange={(e) => update("yes_message", e.target.value)}
              maxLength={300}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition bg-white/80 resize-none"
              placeholder="می‌دونستم دلت نمیاد..."
              dir="auto"
            />
          </div>

          {/* Buttons text */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-1.5">
                متن دکمه بله
              </label>
              <input
                type="text"
                value={form.yes_button_text || ""}
                onChange={(e) => update("yes_button_text", e.target.value)}
                maxLength={40}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition bg-white/80"
                dir="auto"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-1.5">
                متن دکمه نه
              </label>
              <input
                type="text"
                value={form.no_button_text || ""}
                onChange={(e) => update("no_button_text", e.target.value)}
                maxLength={30}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition bg-white/80"
                dir="auto"
              />
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-2">
              تم ظاهری
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(THEMES) as ThemeId[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => update("theme", key)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                    form.theme === key
                      ? "border-pink-500 bg-pink-50 text-pink-700 shadow-md"
                      : "border-pink-100 bg-white text-pink-600 hover:border-pink-300"
                  }`}
                >
                  {THEMES[key].nameFa}
                </button>
              ))}
            </div>
          </div>

          {/* Sender name */}
          <div>
            <label className="block text-sm font-medium text-pink-700 mb-1.5">
              اسم فرستنده (اختیاری)
            </label>
            <input
              type="text"
              value={form.sender_name || ""}
              onChange={(e) => update("sender_name", e.target.value)}
              maxLength={40}
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition bg-white/80"
              placeholder="از طرف..."
              dir="auto"
            />
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 px-4 py-3 rounded-xl text-sm border border-rose-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="spinner" />
                در حال ساخت...
              </>
            ) : (
              <>ساخت لینک اختصاصی من 💌</>
            )}
          </button>
        </form>

        <p className="text-center text-pink-300 text-xs mt-8">
          Made with love ❤️ · One Little Question
        </p>
      </div>
    </div>
  );
}
