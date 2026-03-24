import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {};

        if (!email || !password) {
          return null;
        }

        // Verificação via variáveis de ambiente (conforme AGENTS.md para MVP)
        let adminEmail = process.env.ADMIN_EMAIL;
        let adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        // Remove aspas simples e duplas que podem vir do .env.local
        adminEmail = adminEmail?.replace(/^['"]|['"]$/g, "") ?? "";
        adminPasswordHash =
          adminPasswordHash?.replace(/^['"]|['"]$/g, "") ?? "";

        if (!adminEmail || !adminPasswordHash) {
          throw new Error("Credenciais de admin não configuradas no servidor.");
        }

        // Verifica email e senha (hash)
        if (email === adminEmail) {
          const isValid = await compare(password, adminPasswordHash);
          if (isValid) {
            return { id: "admin", name: "Professor", email: adminEmail };
          }
          console.log("Senha incorreta para o email:", email);
        } else {
          console.log(
            `Email não confere. Recebido: "${email}", Esperado: "${adminEmail}"`,
          );
        }

        console.log("Auth failed");
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
