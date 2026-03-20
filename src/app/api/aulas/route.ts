import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const aulas = await prisma.aula.findMany({
      where: {
        publicada: true,
      },
      orderBy: {
        ordem: "asc",
      },
    });
    return NextResponse.json(aulas);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar aulas" },
      { status: 500 },
    );
  }
}
