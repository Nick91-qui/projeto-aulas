import { hash } from "bcryptjs";
import { stdin as input, stdout as output } from "node:process";
import * as readline from "node:readline/promises";

/**
 * Script para gerar um hash bcrypt para uma senha.
 * Como usar:
 * 1. docker compose exec app node scripts/generate-hash.mjs
 * 2. Digite a senha desejada e pressione Enter.
 */

async function generateHash() {
  const rl = readline.createInterface({ input, output });
  const password = await rl.question("Digite a senha para gerar o hash: ");
  rl.close();

  const passwordHash = await hash(password, 10);

  console.log("\nSenha:", password);
  console.log("Hash:", passwordHash);
  console.log("\nPara .env.local:");
  console.log(`ADMIN_PASSWORD_HASH="${passwordHash}"`);
  console.log("\nPara docker-compose.yml (com escape $$):");
  console.log(`ADMIN_PASSWORD_HASH: ${passwordHash.replace(/\$/g, "$$")}`);
}

generateHash();
