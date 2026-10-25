export type ThemeId = "pink-romance" | "cute-cats" | "love-letter" | "red-velvet" | "custom";

export interface LoveRequest {
  id: string;
  title: string;
  question: string;
  subtitle?: string | null;
  sad_gif_url?: string | null;
  happy_gif_url?: string | null;
  yes_message?: string | null;
  yes_button_text: string;
  no_button_text: string;
  theme: ThemeId;
  accent_color?: string | null;
  sender_name?: string | null;
  intro_message?: string | null;
  final_message?: string | null;
  created_at: string;
  expires_at?: string | null;
  yes_count?: number;
  no_count?: number;
  edit_token?: string;
}

export interface CreateLoveRequestInput {
  title: string;
  question: string;
  subtitle?: string;
  sad_gif_url?: string;
  happy_gif_url?: string;
  yes_message?: string;
  yes_button_text?: string;
  no_button_text?: string;
  theme?: ThemeId;
  accent_color?: string;
  sender_name?: string;
  intro_message?: string;
  final_message?: string;
  expires_at?: string;
}

export const THEMES = {
  "pink-romance": {
    name: "Pink Romance",
    nameFa: "عاشقانه صورتی",
    bg: "from-pink-100 via-rose-50 to-pink-200",
    card: "bg-white/90 border-pink-200",
    accent: "#ec4899",
    buttonYes: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600",
    buttonNo: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    text: "text-pink-800",
  },
  "cute-cats": {
    name: "Cute Cats",
    nameFa: "گربه‌های ناز",
    bg: "from-orange-50 via-amber-50 to-yellow-100",
    card: "bg-white/95 border-orange-200",
    accent: "#f97316",
    buttonYes: "bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600",
    buttonNo: "bg-amber-50 hover:bg-amber-100 text-amber-800",
    text: "text-orange-800",
  },
  "love-letter": {
    name: "Love Letter",
    nameFa: "نامه عاشقانه",
    bg: "from-cream-100 via-amber-50 to-cream-200",
    card: "bg-[#fffdf8] border-cream-300 shadow-md",
    accent: "#b88347",
    buttonYes: "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700",
    buttonNo: "bg-cream-100 hover:bg-cream-200 text-cream-800",
    text: "text-amber-900",
  },
  "red-velvet": {
    name: "Red Velvet",
    nameFa: "مخمل قرمز",
    bg: "from-red-950 via-rose-950 to-red-900",
    card: "bg-red-950/80 border-red-800 text-red-50",
    accent: "#f43f5e",
    buttonYes: "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500",
    buttonNo: "bg-red-900/50 hover:bg-red-800/50 text-red-200",
    text: "text-rose-100",
  },
  custom: {
    name: "Custom",
    nameFa: "سفارشی",
    bg: "from-pink-100 via-white to-rose-100",
    card: "bg-white/90 border-pink-200",
    accent: "#ec4899",
    buttonYes: "bg-gradient-to-r from-pink-500 to-rose-500",
    buttonNo: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    text: "text-pink-800",
  },
} as const;

export const NO_MESSAGES = [
  "مطمئنییی؟ 🥺",
  "یه بار دیگه فکر کن خببب! 💔",
  "ببین دارم کوچولو کوچولو ناراحت می‌شم 😿",
  "این قلب کوچولو طاقت نه شنیدن نداره! 😭❤️",
  "دیگه دارم کل صفحه رو می‌گیرم‌هااا! 🙈",
  "باشه... ولی یه بله کوچولو خیلی خوشحالم می‌کنه! 🥹💕",
  "آخرین شانسهههه! 💘",
  "قلب من داره می‌شکنه... 💔🥺",
];
