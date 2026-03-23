import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

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

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { nome, descricao, ordem } = data;

    if (!nome) {
      return NextResponse.json(
        { error: "Nome do assunto é obrigatório" },
        { status: 400 },
      );
    }

    const slug = nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const assunto = await prisma.assunto.create({
      data: { nome, slug, descricao, ordem: Number(ordem) || 0 },
    });

    return NextResponse.json(assunto, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar assunto" },
      { status: 500 },
    );
  }
}
