import { render, screen } from "@testing-library/react";
import { ArquivoLink } from "@/components/aulas/ArquivoLink";
import "@testing-library/jest-dom";

describe("ArquivoLink", () => {
  const mockArquivo = {
    id: "1",
    nome: "Slides da Aula",
    url: "https://example.com/slides.pdf",
    tipo: "slides",
    aulaId: "aula-1",
  };

  it("renderiza o nome do arquivo e o ícone correspondente", () => {
    render(<ArquivoLink arquivo={mockArquivo} />);

    expect(screen.getByText("Slides da Aula")).toBeInTheDocument();
    // Verifica se o ícone de slides (📊) está presente conforme definido no componente
    expect(screen.getByText("📊")).toBeInTheDocument();
    expect(screen.getByText("slides")).toBeInTheDocument();
  });

  it("tem o link correto para abertura em nova aba", () => {
    render(<ArquivoLink arquivo={mockArquivo} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://example.com/slides.pdf");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
