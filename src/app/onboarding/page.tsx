import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InterestPicker } from "@/components/InterestPicker";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const interests = await prisma.interest.findMany({
    orderBy: { label: "asc" },
    select: { key: true, label: true },
  });

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-semibold text-center mb-1">
          Quels sujets t&apos;intéressent ?
        </h1>
        <p className="text-sm text-neutral-500 text-center mb-8">
          Choisis au moins un domaine. Tu pourras changer ça plus tard.
        </p>

        <InterestPicker interests={interests} />
      </div>
    </main>
  );
}
