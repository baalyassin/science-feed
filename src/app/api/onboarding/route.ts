import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const onboardingSchema = z.object({
  interestKeys: z.array(z.string()).min(1, "Choisis au moins un centre d'intérêt."),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = onboardingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Requête invalide." },
      { status: 400 },
    );
  }

  const interests = await prisma.interest.findMany({
    where: { key: { in: parsed.data.interestKeys } },
    select: { id: true },
  });

  await prisma.$transaction([
    prisma.userInterest.deleteMany({ where: { userId: session.user.id } }),
    prisma.userInterest.createMany({
      data: interests.map((interest) => ({
        userId: session.user.id,
        interestId: interest.id,
      })),
    }),
    prisma.user.update({
      where: { id: session.user.id },
      data: { onboardedAt: new Date() },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
