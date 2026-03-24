const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.error("Erro: Por favor, forneça a senha desejada como argumento.");
  console.log('Exemplo: node scripts/generate-hash.js "MinhaSenhaSegura"');
  process.exit(1);
}

const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error("Erro ao gerar hash:", err);
    return;
  }
  console.log("\n--- Copie o valor abaixo para seu arquivo .env.local ---");
  console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
  console.log("------------------------------------------------------\n");
});
