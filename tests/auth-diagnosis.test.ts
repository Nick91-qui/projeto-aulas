/**
 * Teste de Diagnóstico de Autenticação
 * Execute com: docker compose exec app npm test tests/auth-diagnosis.test.ts
 */
import { compare, hash } from "bcryptjs";

describe("Diagnóstico de Autenticação (Bcrypt)", () => {
  // O hash esperado para a senha 'admin' (baseado no docker-compose.yml)
  // Devemos usar apenas um $ aqui, pois é assim que a string real deve ser
  const EXPECTED_HASH_PREFIX = "$2a$10$";
  const TEST_PASSWORD = "admin";

  it("deve ter a variável de ambiente ADMIN_PASSWORD_HASH definida", () => {
    const envHash = process.env.ADMIN_PASSWORD_HASH;
    expect(envHash).toBeDefined();
    console.log("HASH recebido pela aplicação:", envHash);

    // Verifica se o hash começa com $2a$ (ou $2b$) e não $$2a$$
    if (envHash?.startsWith("$$2a")) {
      throw new Error(
        'ERRO CRÍTICO: O hash contém "$$" duplicado. Se você está rodando localmente, corrija seu .env.local para usar apenas um "$".',
      );
    }
  });

  it('deve validar a senha "admin" contra o hash do ambiente', async () => {
    const envHash = process.env.ADMIN_PASSWORD_HASH || "";

    // Tenta comparar a senha 'admin' com o hash do ambiente
    const isValid = await compare(TEST_PASSWORD, envHash);

    expect(isValid).toBe(true);
    console.log(
      `Senha "${TEST_PASSWORD}" válida para o hash atual? ${isValid ? "SIM" : "NÃO"}`,
    );
  });
});
