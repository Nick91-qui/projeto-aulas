import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const assuntos = await prisma.assunto.findMany({
      orderBy: { ordem: "asc" },
      include: {
        aulas: {
          where: { publicada: true },
          orderBy: { ordem: "asc" },
        },
      },
    });
    return NextResponse.json(assuntos);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar assuntos" },
      { status: 500 },
    );
  }
}
