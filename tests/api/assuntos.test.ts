/**
 * @jest-environment node
 */
import { GET } from "@/app/api/assuntos/route";
import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    assunto: {
      findMany: jest.fn(),
    },
  },
}));

describe("GET /api/assuntos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("retorna lista de assuntos com suas aulas publicadas", async () => {
    const mockAssuntos = [
      {
        id: "1",
        nome: "Química Geral",
        slug: "quimica-geral",
        ordem: 1,
        aulas: [{ id: "a1", titulo: "Aula 1", publicada: true, ordem: 1 }],
      },
    ];

    (prisma.assunto.findMany as jest.Mock).mockResolvedValue(mockAssuntos);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockAssuntos);

    expect(prisma.assunto.findMany).toHaveBeenCalledWith({
      orderBy: { ordem: "asc" },
      include: {
        aulas: {
          where: { publicada: true },
          orderBy: { ordem: "asc" },
        },
      },
    });
  });

  test("retorna 500 se o banco falhar", async () => {
    (prisma.assunto.findMany as jest.Mock).mockRejectedValue(
      new Error("DB Error"),
    );
    const response = await GET();
    expect(response.status).toBe(500);
  });
});
