"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NovoAssuntoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      nome: formData.get("nome"),
      descricao: formData.get("descricao"),
      ordem: Number(formData.get("ordem")),
    };

    try {
      const res = await fetch("/api/assuntos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Falha ao criar assunto");
      }

      router.push("/admin/assuntos");
      router.refresh();
    } catch (err) {
      setError("Ocorreu um erro ao criar o assunto. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Novo Assunto
          </h2>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6"
      >
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="nome"
            className="block text-sm font-medium text-gray-700"
          >
            Nome
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="nome"
              id="nome"
              required
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="descricao"
            className="block text-sm font-medium text-gray-700"
          >
            Descrição
          </label>
          <div className="mt-1">
            <textarea
              id="descricao"
              name="descricao"
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Breve descrição do que será abordado neste assunto.
          </p>
        </div>

        <div>
          <label
            htmlFor="ordem"
            className="block text-sm font-medium text-gray-700"
          >
            Ordem
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="ordem"
              id="ordem"
              defaultValue={0}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Número para ordenar a exibição dos assuntos.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <Link
            href="/admin/assuntos"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
          >
            Cancelar
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
