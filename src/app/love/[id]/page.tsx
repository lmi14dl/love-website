import { notFound } from "next/navigation";
import { getLoveRequest } from "@/lib/storage";
import RecipientView from "@/components/RecipientView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LovePage({ params }: Props) {
  const { id } = await params;
  console.log(`[page] LovePage rendering for id=${id}`);

  let request;
  try {
    request = await getLoveRequest(id);
  } catch (err) {
    console.error("[page] Error in getLoveRequest:", err);
    notFound();
  }

  if (!request) {
    console.log(`[page] No request found for ${id}, calling notFound()`);
    notFound();
  }

  console.log(`[page] Rendering RecipientView for ${id}`);
  return <RecipientView request={request} />;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const request = await getLoveRequest(id);

  if (!request) {
    return { title: "یافت نشد 💔" };
  }

  return {
    title: request.title || "یه درخواست کوچولو ❤️",
    description: request.question?.slice(0, 100) || "A little romantic question for you...",
    openGraph: {
      title: request.title,
      description: request.question?.slice(0, 120),
    },
  };
}
