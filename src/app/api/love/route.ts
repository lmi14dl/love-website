import { NextRequest, NextResponse } from "next/server";
import { createLoveRequest } from "@/lib/storage";
import type { CreateLoveRequestInput } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateLoveRequestInput;

    if (!body.title?.trim() || !body.question?.trim()) {
      return NextResponse.json(
        { error: "عنوان و سوال اصلی الزامی هستند" },
        { status: 400 }
      );
    }

    if (body.title.length > 120 || body.question.length > 600) {
      return NextResponse.json(
        { error: "متن‌ها خیلی طولانی هستند" },
        { status: 400 }
      );
    }

    // Basic URL validation for GIFs
    const urlPattern = /^https?:\/\/.+/i;
    if (body.sad_gif_url && !urlPattern.test(body.sad_gif_url)) {
      return NextResponse.json(
        { error: "آدرس GIF غمگین معتبر نیست" },
        { status: 400 }
      );
    }
    if (body.happy_gif_url && !urlPattern.test(body.happy_gif_url)) {
      return NextResponse.json(
        { error: "آدرس GIF شاد معتبر نیست" },
        { status: 400 }
      );
    }

    const { request, editToken, shareUrl } = await createLoveRequest(body);

    return NextResponse.json({
      id: request.id,
      shareUrl,
      editToken,
    });
  } catch (err) {
    console.error("Create love request error:", err);
    return NextResponse.json(
      { error: "خطا در ساخت درخواست. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}
