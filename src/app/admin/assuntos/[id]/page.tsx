import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditarAssuntoForm from "./form";

export default async function EditarAssuntoPage({
  params,
}: {
  params: { id: string };
}) {
  const assunto = await prisma.assunto.findUnique({
    where: { id: params.id },
  });

  if (!assunto) {
    notFound();
  }

  return <EditarAssuntoForm assunto={assunto} />;
}
