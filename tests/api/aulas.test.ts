/**
 * @jest-environment node
 */
import { GET } from "@/app/api/aulas/route";
import { prisma } from "@/lib/prisma";

// Mock do Prisma para evitar chamadas reais ao banco nos testes unitários
jest.mock("@/lib/prisma", () => ({
  prisma: {
    aula: {
      findMany: jest.fn(),
    },
  },
}));

describe("GET /api/aulas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("retorna apenas aulas publicadas ordenadas por ordem", async () => {
    const mockAulas = [
      { id: "1", titulo: "Aula 1", publicada: true, ordem: 1 },
      { id: "2", titulo: "Aula 2", publicada: true, ordem: 2 },
    ];

    (prisma.aula.findMany as jest.Mock).mockResolvedValue(mockAulas);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(2);
    expect(data).toEqual(mockAulas);

    // Verifica se o Prisma foi chamado com os filtros corretos
    expect(prisma.aula.findMany).toHaveBeenCalledWith({
      where: { publicada: true },
      orderBy: { ordem: "asc" },
    });
  });

  test("retorna 500 se o banco falhar", async () => {
    (prisma.aula.findMany as jest.Mock).mockRejectedValue(
      new Error("DB Error"),
    );

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error");
  });
});
