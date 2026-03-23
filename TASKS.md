# TASKS.md — Checklist de Desenvolvimento

Acompanhamento das etapas do projeto.
Marque cada tarefa com `[x]` ao concluir.
Siga a ordem das etapas — cada uma depende da anterior.

> **Instrução padrão para o agente:**
> "Leia o AGENTS.md e o TASKS.md. Vamos executar a [nome da tarefa].
> Siga o TDD onde aplicável e me explique cada decisão antes de escrever o código."

---

## Etapa 1 — Configuração inicial do projeto

- [x] Inicializar projeto Next.js com TypeScript e Tailwind (`create-next-app`)
- [x] Instalar e configurar Jest (`jest`, `@testing-library/react`, `@testing-library/jest-dom`)
- [x] Criar `jest.config.ts`
- [x] Criar `.env.example` com todas as variáveis necessárias
- [x] Criar `.env.local` com valores reais (nunca commitar)
- [x] Verificar que `.env.local` está no `.gitignore`
- [x] Commit: `chore: configura Next.js, TypeScript, Tailwind e Jest`

---

## Etapa 2 — Ambiente Docker

- [x] Criar `Dockerfile` conforme modelo do `AGENTS.md` (seção 14)
- [x] Criar `docker-compose.yml` com serviços `app` e `db`
- [x] Criar `.dockerignore`
- [x] Rodar `docker compose up --build` e verificar que o site abre em `localhost:3000`
- [x] Verificar que o container `db` (Postgres) sobe sem erros
- [x] Commit: `chore: adiciona ambiente Docker com Next.js e Postgres`

---

## Etapa 3 — Banco de dados

> A partir desta etapa, todos os comandos Prisma rodam dentro do container:
> `docker compose exec app npx prisma ...`

- [x] Instalar Prisma (`prisma`, `@prisma/client`) dentro do container
- [x] Rodar `docker compose exec app npx prisma init`
- [x] Criar `prisma/schema.prisma` conforme modelo do `AGENTS.md` (seção 4)
- [x] Confirmar que `DATABASE_URL` no container aponta para o Postgres local (`@db:5432`)
- [x] Rodar primeira migration: `docker compose exec app npx prisma migrate dev --name init`
- [x] Criar `src/lib/prisma.ts` (instância global do PrismaClient)
- [x] Criar `prisma/seed.ts` com pelo menos 1 assunto e 1 aula de exemplo
- [x] Rodar seed: `docker compose exec app npx prisma db seed`
- [x] Verificar dados no Prisma Studio: `docker compose exec app npx prisma studio`
- [x] Commit: `chore: configura Prisma e banco de dados local`

---

## Etapa 4 — API Routes (TDD)

> Nesta etapa: escrever o teste ANTES do código (Red → Green → Refactor)

### Aulas

- [x] Escrever testes: `tests/api/aulas.test.ts`
  - [x] GET retorna apenas aulas publicadas
  - [x] GET retorna 500 se o banco falhar
- [x] Implementar `src/app/api/aulas/route.ts` (GET)
- [x] Verificar testes passando: `docker compose exec app npm test`

### Assuntos

- [x] Escrever testes: `tests/api/assuntos.test.ts`
  - [x] GET retorna lista de assuntos com suas aulas publicadas
  - [x] GET retorna 500 se o banco falhar
- [x] Implementar `src/app/api/assuntos/route.ts` (GET)
- [x] Verificar testes passando: `docker compose exec app npm test`

- [x] Commit: `feat: adiciona API Routes de aulas e assuntos com testes`

---

## Etapa 5 — Componentes base

> Nesta etapa: testes após o código (componentes visuais)

- [x] Criar `src/app/layout.tsx` (layout raiz com fonte Inter, Header e Footer)
- [x] Criar `src/components/layout/Header.tsx`
- [x] Criar `src/components/layout/Footer.tsx`
- [x] Criar `src/components/aulas/AulaCard.tsx`
- [x] Criar `src/components/aulas/ArquivoLink.tsx`
- [x] Criar `src/components/ui/Button.tsx`
- [x] Criar `src/components/ui/Badge.tsx`
- [x] Escrever testes: `tests/components/AulaCard.test.tsx`
- [x] Escrever testes: `tests/components/ArquivoLink.test.tsx`
- [x] Verificar testes passando: `docker compose exec app npm test`
- [x] Commit: `feat: adiciona componentes base e layout raiz`

---

## Etapa 6 — Páginas públicas

- [x] Criar `src/app/page.tsx` (página inicial)
- [x] Criar `src/app/assuntos/page.tsx` (listagem de assuntos)
- [x] Criar `src/app/assuntos/[slug]/page.tsx` (página do assunto com suas aulas)
- [x] Criar `src/app/assuntos/[slug]/[aulaSlug]/page.tsx` (página individual da aula)
- [x] Verificar navegação entre páginas funcionando localmente
- [x] Verificar responsividade (mobile e desktop)
- [x] Commit: `feat: adiciona páginas públicas do site`

---

## Etapa 7 — Deploy MVP

- [x] Conectar repositório GitHub à Vercel (já existente)
- [x] Configurar `DATABASE_URL` do Neon nas variáveis de ambiente da Vercel
- [x] Configurar demais variáveis de ambiente na Vercel
- [x] Verificar build sem erros: `docker compose exec app npm run build`
- [x] Acessar URL pública e testar todas as páginas
- [x] Commit: `chore: configuração de deploy na Vercel`

---

## Etapa 8 — Painel admin

> Início da Fase 2 — só iniciar após o MVP estar no ar e funcionando

- [x] Instalar NextAuth.js (`next-auth`, `bcryptjs`)
- [x] Criar `src/lib/auth.ts` com configuração do provider Credentials
- [x] Criar `src/app/api/auth/[...nextauth]/route.ts`
- [x] Criar página de login: `src/app/admin/login/page.tsx`
- [x] Criar `src/app/admin/layout.tsx` com verificação de sessão
- [x] Criar dashboard admin: `src/app/admin/page.tsx`

### CRUD de assuntos

- [ ] Escrever testes: `tests/api/assuntos-admin.test.ts` (POST protegido)
- [ ] Implementar POST em `src/app/api/assuntos/route.ts`
- [ ] Criar página de gerenciamento: `src/app/admin/assuntos/page.tsx`

### CRUD de aulas

- [ ] Escrever testes: `tests/api/aulas-admin.test.ts` (POST, PUT, DELETE protegidos)
- [ ] Implementar POST em `src/app/api/aulas/route.ts`
- [ ] Criar listagem admin: `src/app/admin/aulas/page.tsx`
- [ ] Criar formulário de criação: `src/app/admin/aulas/nova/page.tsx`
- [ ] Criar formulário de edição: `src/app/admin/aulas/[id]/page.tsx`
- [ ] Verificar testes passando: `docker compose exec app npm test`
- [ ] Commit: `feat: adiciona painel admin com autenticação e CRUD`

---

## Etapa 9 — Melhorias futuras

> Iniciar apenas após as etapas 1–8 concluídas e o site em uso pelos alunos

- [ ] Busca de conteúdo
- [ ] Feedback / comentários de alunos
- [ ] Migração de arquivos para Cloudflare R2
- [ ] Vercel Analytics
- [ ] Modo escuro

---

## Progresso geral

| Etapa                    | Status          |
| ------------------------ | --------------- |
| 1 — Configuração inicial | ✅ em andamento |
| 2 — Ambiente Docker      | ✅ concluída    |
| 3 — Banco de dados       | ✅ concluída    |
| 4 — API Routes (TDD)     | 🟡 em andamento |
| 5 — Componentes base     | ✅ concluída    |
| 6 — Páginas públicas     | ✅ concluída    |
| 7 — Deploy MVP           | ✅ concluída    |
| 8 — Painel admin         | 🟡 em andamento |
| 9 — Melhorias futuras    | ⬜ não iniciada |

---

_Atualizar a tabela de progresso conforme as etapas forem concluídas._
_⬜ não iniciada · 🟡 em andamento · ✅ concluída_
