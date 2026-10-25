import Link from "next/link";
import FloatingHearts from "@/components/FloatingHearts";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 flex items-center justify-center p-4 relative">
      <FloatingHearts count={8} />
      <div className="relative z-10 text-center space-y-4 max-w-sm">
        <div className="text-6xl">💔</div>
        <h1 className="text-2xl font-bold text-pink-700">لینک پیدا نشد</h1>
        <p className="text-pink-500 text-sm">
          این درخواست ممکنه منقضی شده باشه یا آدرس اشتباه باشه.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium shadow-lg hover:shadow-xl transition-all"
        >
          ساخت درخواست جدید 💌
        </Link>
      </div>
    </div>
  );
}
