import { POST } from "@/app/api/assuntos/route";
import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// Mocka a dependência externa 'next-auth/next' para controlar o estado da sessão.
jest.mock("next-auth/next");

jest.mock("@/lib/prisma", () => ({
  prisma: {
    assunto: {
      create: jest.fn(),
    },
  },
}));

// Faz o cast da função mockada para jest.Mock para ter acesso aos métodos de mock (ex: mockResolvedValue)
const mockedGetServerSession = getServerSession as jest.Mock;

describe("POST /api/assuntos (Admin)", () => {
  // Limpa os mocks após cada teste para garantir o isolamento entre eles.
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("deve retornar 401 (Não autorizado) se o usuário não estiver autenticado", async () => {
    // Arrange: Simula um usuário não autenticado fazendo o getServerSession retornar null.
    mockedGetServerSession.mockResolvedValue(null);

    const newAssuntoData = {
      nome: "Novo Assunto Teste",
      descricao: "Descrição do novo assunto de teste.",
    };

    const request = new NextRequest("http://localhost/api/assuntos", {
      method: "POST",
      body: JSON.stringify(newAssuntoData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Act: Chama o handler da rota (que ainda não existe, causando a falha inicial).
    const response = await POST(request);
    const body = await response.json();

    // Assert: Verifica se a resposta é a esperada para um acesso não autorizado.
    expect(response.status).toBe(401);
    expect(body).toEqual({ error: "Não autorizado" });
    expect(prisma.assunto.create).not.toHaveBeenCalled();
  });
});
