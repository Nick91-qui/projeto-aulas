const bcrypt = require("bcryptjs");

async function debug() {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const email = process.env.ADMIN_EMAIL;
  const password = "123456";

  console.log("\n========== DEBUG VARIÁVEIS DE AMBIENTE ==========\n");
  console.log("ADMIN_EMAIL:", email);
  console.log("ADMIN_PASSWORD_HASH:", hash);
  console.log("\nTamanho do hash:", hash ? hash.length : "undefined");
  console.log(
    "Hash válido (começa com $2a$ ou $2b$):",
    hash && (hash.startsWith("$2a$") || hash.startsWith("$2b$")),
  );

  if (!hash) {
    console.log("\n❌ ERRO: ADMIN_PASSWORD_HASH não está definido!");
    process.exit(1);
  }

  console.log("\n========== TESTE DE BCRYPT ==========\n");
  console.log("Testando bcrypt.compare com:");
  console.log("- Senha: 123456");
  console.log("- Hash:", hash.substring(0, 30) + "...");

  try {
    const result = await bcrypt.compare(password, hash);
    console.log("\n✓ Resultado do bcrypt.compare:", result);
    if (result) {
      console.log("✅ SUCESSO! Senha combina com o hash!");
    } else {
      console.log("❌ FALHA! Senha NÃO combina com o hash!");
      console.log("\nPossíveis causas:");
      console.log("1. Hash está truncado ou corrompido");
      console.log("2. Caracteres especiais foram expandidos (ex: $)");
      console.log("3. Senha usada para gerar o hash é diferente");
    }
  } catch (error) {
    console.log("\n❌ ERRO ao executar bcrypt.compare:");
    console.log(error.message);
  }

  console.log("\n==============================================\n");
}

debug();
