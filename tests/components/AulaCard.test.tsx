import { render, screen } from "@testing-library/react";
import { AulaCard } from "@/components/aulas/AulaCard";
import "@testing-library/jest-dom";

describe("AulaCard", () => {
  const mockAula = {
    id: "1",
    slug: "aula-teste",
    titulo: "Aula de Teste",
    descricao: "Uma descrição para teste",
    conteudo: "Conteúdo",
    publicada: true,
    ordem: 1,
    criadaEm: new Date(),
    assuntoId: "assunto-1",
  };

  it("renderiza o título e a descrição da aula", () => {
    render(<AulaCard aula={mockAula} assuntoSlug="quimica-geral" />);

    expect(screen.getByText("Aula de Teste")).toBeInTheDocument();
    expect(screen.getByText("Uma descrição para teste")).toBeInTheDocument();
  });

  it("contém o link correto para a aula", () => {
    render(<AulaCard aula={mockAula} assuntoSlug="quimica-geral" />);

    // Procura um link que contenha o título da aula
    const link = screen.getByRole("link", { name: /Aula de Teste/i });

    expect(link).toHaveAttribute("href", "/assuntos/quimica-geral/aula-teste");
  });
});
