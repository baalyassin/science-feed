import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FeedList } from "@/components/FeedList";

export default async function FeedPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardedAt: true },
  });

  if (!user?.onboardedAt) {
    redirect("/onboarding");
  }

  return <FeedList />;
}
