# TASKS.md — Checklist de Desenvolvimento

Acompanhamento das etapas do projeto.
Marque cada tarefa com `[x]` ao concluir.
Siga a ordem das etapas — cada uma depende da anterior.

> **Instrução padrão para o agente:**
> "Leia o AGENTS.md. Vamos executar a [nome da tarefa].
> Siga o TDD onde aplicável e me explique cada decisão antes de escrever o código."

---

## Etapa 1 — Configuração inicial

- [ ] Inicializar projeto Next.js com TypeScript e Tailwind (`create-next-app`)
- [ ] Instalar e configurar Jest (`jest`, `@testing-library/react`, `@testing-library/jest-dom`)
- [ ] Criar `jest.config.ts`
- [ ] Criar `.env.example` com todas as variáveis necessárias
- [ ] Criar `.env.local` com valores reais (nunca commitar)
- [ ] Verificar que `.env.local` está no `.gitignore`
- [ ] Commit: `chore: configura Next.js, TypeScript, Tailwind e Jest`

---

## Etapa 2 — Banco de dados

- [ ] Instalar Prisma (`prisma`, `@prisma/client`)
- [ ] Rodar `npx prisma init`
- [ ] Criar `prisma/schema.prisma` conforme modelo do `AGENTS.md` (seção 4)
- [ ] Conectar `DATABASE_URL` ao banco Neon no `.env.local`
- [ ] Rodar primeira migration: `npx prisma migrate dev --name init`
- [ ] Criar `src/lib/prisma.ts` (instância global do PrismaClient)
- [ ] Criar `prisma/seed.ts` com pelo menos 1 assunto e 1 aula de exemplo
- [ ] Rodar `npx prisma db seed` e verificar dados no Prisma Studio
- [ ] Commit: `chore: configura Prisma e banco de dados Neon`

---

## Etapa 3 — API Routes (TDD)

> Nesta etapa: escrever o teste ANTES do código (Red → Green → Refactor)

### Aulas
- [ ] Escrever testes: `tests/api/aulas.test.ts`
  - [ ] GET retorna apenas aulas publicadas
  - [ ] GET retorna 500 se o banco falhar
- [ ] Implementar `src/app/api/aulas/route.ts` (GET)
- [ ] Verificar testes passando: `npm test`

### Assuntos
- [ ] Escrever testes: `tests/api/assuntos.test.ts`
  - [ ] GET retorna lista de assuntos com suas aulas publicadas
  - [ ] GET retorna 500 se o banco falhar
- [ ] Implementar `src/app/api/assuntos/route.ts` (GET)
- [ ] Verificar testes passando: `npm test`

- [ ] Commit: `feat: adiciona API Routes de aulas e assuntos com testes`

---

## Etapa 4 — Componentes base

> Nesta etapa: testes após o código (componentes visuais)

- [ ] Criar `src/app/layout.tsx` (layout raiz com fonte Inter, Header e Footer)
- [ ] Criar `src/components/layout/Header.tsx`
- [ ] Criar `src/components/layout/Footer.tsx`
- [ ] Criar `src/components/aulas/AulaCard.tsx`
- [ ] Criar `src/components/aulas/ArquivoLink.tsx`
- [ ] Criar `src/components/ui/Button.tsx`
- [ ] Criar `src/components/ui/Badge.tsx`
- [ ] Escrever testes: `tests/components/AulaCard.test.tsx`
- [ ] Escrever testes: `tests/components/ArquivoLink.test.tsx`
- [ ] Verificar testes passando: `npm test`
- [ ] Commit: `feat: adiciona componentes base e layout raiz`

---

## Etapa 5 — Páginas públicas

- [ ] Criar `src/app/page.tsx` (página inicial)
- [ ] Criar `src/app/assuntos/page.tsx` (listagem de assuntos)
- [ ] Criar `src/app/assuntos/[slug]/page.tsx` (página do assunto com suas aulas)
- [ ] Criar `src/app/assuntos/[slug]/[aulaSlug]/page.tsx` (página individual da aula)
- [ ] Verificar navegação entre páginas funcionando localmente
- [ ] Verificar responsividade (mobile e desktop)
- [ ] Commit: `feat: adiciona páginas públicas do site`

---

## Etapa 6 — Deploy MVP

- [ ] Conectar repositório GitHub à Vercel
- [ ] Configurar variáveis de ambiente na Vercel (mesmas do `.env.local`)
- [ ] Verificar build sem erros: `npm run build`
- [ ] Acessar URL pública e testar todas as páginas
- [ ] Commit: `chore: configuração de deploy na Vercel`

---

## Etapa 7 — Painel admin

> Início da Fase 2 — só iniciar após o MVP estar no ar e funcionando

- [ ] Instalar NextAuth.js (`next-auth`, `bcryptjs`)
- [ ] Criar `src/lib/auth.ts` com configuração do provider Credentials
- [ ] Criar `src/app/api/auth/[...nextauth]/route.ts`
- [ ] Criar página de login: `src/app/admin/login/page.tsx`
- [ ] Criar `src/app/admin/layout.tsx` com verificação de sessão
- [ ] Criar dashboard admin: `src/app/admin/page.tsx`

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
- [ ] Verificar testes passando: `npm test`
- [ ] Commit: `feat: adiciona painel admin com autenticação e CRUD`

---

## Etapa 8 — Melhorias futuras

> Iniciar apenas após as etapas 1–7 concluídas e o site em uso pelos alunos

- [ ] Busca de conteúdo
- [ ] Feedback / comentários de alunos
- [ ] Migração de arquivos para Cloudflare R2
- [ ] Vercel Analytics
- [ ] Modo escuro

---

## Progresso geral

| Etapa | Status |
|---|---|
| 1 — Configuração inicial | ⬜ não iniciada |
| 2 — Banco de dados | ⬜ não iniciada |
| 3 — API Routes (TDD) | ⬜ não iniciada |
| 4 — Componentes base | ⬜ não iniciada |
| 5 — Páginas públicas | ⬜ não iniciada |
| 6 — Deploy MVP | ⬜ não iniciada |
| 7 — Painel admin | ⬜ não iniciada |
| 8 — Melhorias futuras | ⬜ não iniciada |

---

*Atualizar a tabela de progresso conforme as etapas forem concluídas.*
*⬜ não iniciada · 🟡 em andamento · ✅ concluída*
