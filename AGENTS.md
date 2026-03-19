# AGENTS.md — Site Educacional de Química

Guia de desenvolvimento para o agente de IA (Gemini no VSCode).
Leia este arquivo por completo antes de escrever qualquer código.
Em caso de dúvida sobre uma decisão técnica, consulte este documento antes de improvisar.

---

## Índice

1. [Visão geral do projeto](#1-visão-geral-do-projeto)
2. [Stack tecnológica](#2-stack-tecnológica)
3. [Organização do conteúdo](#3-organização-do-conteúdo)
4. [Modelo de dados (Prisma)](#4-modelo-de-dados-prisma)
5. [Estrutura de pastas](#5-estrutura-de-pastas)
6. [Variáveis de ambiente](#6-variáveis-de-ambiente)
7. [Autenticação](#7-autenticação)
8. [Padrões de código](#8-padrões-de-código)
9. [Visual e estilo](#9-visual-e-estilo)
10. [Testes (TDD pragmático)](#10-testes-abordagem-tdd-pragmático)
11. [Git e commits](#11-git-e-commits)
12. [Roadmap de desenvolvimento](#12-roadmap-de-desenvolvimento)
13. [Gerenciamento de dependências e conflitos](#13-gerenciamento-de-dependências-e-conflitos)
14. [Ambiente de desenvolvimento (Docker)](#14-ambiente-de-desenvolvimento-docker)
15. [O que o agente NÃO deve fazer](#15-o-que-o-agente-não-deve-fazer)
16. [Como pedir ajuda ao agente](#16-como-pedir-ajuda-ao-agente)

---

## 1. Visão geral do projeto

Site educacional de Química para alunos do ensino médio, desenvolvido e mantido pelo professor.
O objetivo principal é disponibilizar conteúdos de aula de forma organizada e acessível.

**Público-alvo:** alunos do ensino médio (acesso público, sem login)
**Responsável pelo conteúdo:** o professor (via painel admin protegido por login)
**Fase atual:** MVP — foco em entregar valor real antes de adicionar complexidade

---

## 2. Stack tecnológica

Não sugira tecnologias fora desta lista sem justificativa explícita e aprovação do desenvolvedor.

| Camada                           | Tecnologia                           | Versão exata |
| -------------------------------- | ------------------------------------ | ------------ |
| Runtime                          | Node.js                              | 20 LTS       |
| Framework                        | Next.js (App Router)                 | 14.2.35      |
| Linguagem                        | TypeScript                           | 5.x          |
| Estilo                           | Tailwind CSS                         | 3.4.x        |
| Banco de dados (produção)        | PostgreSQL via Neon (serverless)     | —            |
| Banco de dados (desenvolvimento) | PostgreSQL via Docker                | 16-alpine    |
| ORM                              | Prisma                               | 5.x          |
| Autenticação                     | NextAuth.js                          | 4.x          |
| Deploy                           | Vercel                               | —            |
| Armazenamento de arquivos        | Google Drive (links externos) no MVP | —            |
| Testes                           | Jest                                 | 29.x         |
| Testes                           | @testing-library/react               | 14.x         |
| Controle de versão               | Git + GitHub                         | —            |

### Decisões técnicas já tomadas (não reabrir)

- **Google Drive para arquivos no MVP:** o banco armazena apenas a URL. Migração futura para Cloudflare R2 é simples — só atualiza os links.
- **Sem autenticação de alunos no MVP:** alunos acessam tudo publicamente. Login existe apenas para o professor (painel admin).
- **App Router do Next.js:** não usar Pages Router. Todo roteamento segue a convenção `src/app/`.
- **Tailwind para estilo:** não criar arquivos CSS separados. Não usar CSS-in-JS (styled-components, emotion, etc.).
- **Docker para desenvolvimento local:** Next.js + Postgres rodam em containers. Em produção, o banco é o Neon.

---

## 3. Organização do conteúdo

O conteúdo é organizado por **assunto/tema**, não por série.
Cada assunto pode ter múltiplos tipos de material associado.

### Tipos de conteúdo suportados

| Tipo        | Descrição                                         |
| ----------- | ------------------------------------------------- |
| `slides`    | Apresentação em PDF (link do Google Drive)        |
| `texto`     | Texto explicativo escrito em Markdown             |
| `exercicio` | Lista de exercícios em PDF (link do Google Drive) |
| `imagem`    | Imagem ou diagrama (link externo)                 |

### Hierarquia dos dados

```
Assunto (ex: "Ligações Químicas")
└── Aulas (ex: "Ligações Iônicas", "Ligações Covalentes")
    └── Arquivos (slides, exercícios, imagens vinculados à aula)
```

---

## 4. Modelo de dados (Prisma)

Este é o schema canônico. Não altere a estrutura sem discutir com o desenvolvedor.

```prisma
model Assunto {
  id        String   @id @default(cuid())
  slug      String   @unique
  nome      String
  descricao String?
  ordem     Int      @default(0)
  aulas     Aula[]
  criadoEm  DateTime @default(now())
}

model Aula {
  id        String   @id @default(cuid())
  slug      String   @unique
  titulo    String
  descricao String?
  conteudo  String?  @db.Text
  publicada Boolean  @default(false)
  ordem     Int      @default(0)
  criadaEm  DateTime @default(now())

  assuntoId String
  assunto   Assunto  @relation(fields: [assuntoId], references: [id])
  arquivos  Arquivo[]
}

model Arquivo {
  id   String @id @default(cuid())
  nome String
  url  String
  tipo String  // "slides" | "texto" | "exercicio" | "imagem"

  aulaId String
  aula   Aula   @relation(fields: [aulaId], references: [id], onDelete: Cascade)
}
```

### Regras do modelo

- O campo `publicada` controla visibilidade. Aulas com `publicada: false` não aparecem para alunos.
- O campo `ordem` define a sequência de exibição dentro de um assunto.
- `onDelete: Cascade` em Arquivo garante que arquivos sejam removidos junto com a aula.
- Nunca remova campos existentes sem criar uma migration de dados primeiro.

---

## 5. Estrutura de pastas

Siga esta estrutura exatamente. Não crie pastas fora deste padrão.

```
projeto-aulas/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
│   └── images/               ← imagens estáticas do site (logo, favicon)
├── src/
│   ├── app/
│   │   ├── layout.tsx                ← layout raiz (header, footer, fonte)
│   │   ├── page.tsx                  ← página inicial
│   │   ├── assuntos/
│   │   │   ├── page.tsx              ← listagem de assuntos
│   │   │   └── [slug]/
│   │   │       ├── page.tsx          ← página do assunto com suas aulas
│   │   │       └── [aulaSlug]/
│   │   │           └── page.tsx      ← página individual da aula
│   │   ├── admin/
│   │   │   ├── layout.tsx            ← layout protegido (verifica sessão)
│   │   │   ├── page.tsx              ← dashboard admin
│   │   │   ├── aulas/
│   │   │   │   ├── page.tsx          ← listagem de aulas no admin
│   │   │   │   ├── nova/
│   │   │   │   │   └── page.tsx      ← formulário de criação
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      ← formulário de edição
│   │   │   └── assuntos/
│   │   │       └── page.tsx          ← gerenciar assuntos
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts      ← NextAuth handler
│   │       ├── aulas/
│   │       │   └── route.ts          ← GET (público), POST (admin)
│   │       └── assuntos/
│   │           └── route.ts          ← GET (público), POST (admin)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── aulas/
│   │   │   ├── AulaCard.tsx
│   │   │   └── ArquivoLink.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       └── Badge.tsx
│   ├── lib/
│   │   ├── prisma.ts         ← instância global do PrismaClient
│   │   └── auth.ts           ← configuração do NextAuth
│   └── types/
│       └── index.ts          ← tipos TypeScript compartilhados
├── tests/
│   ├── components/
│   ├── api/
│   └── lib/
├── Dockerfile                ← container do Next.js
├── docker-compose.yml        ← orquestra Next.js + Postgres
├── .dockerignore
├── .env.local                ← NUNCA commitar
├── .env.example              ← commitar (sem valores reais)
├── .nvmrc                    ← versão do Node.js fixada
├── .gitignore
├── README.md
├── TASKS.md
└── AGENTS.md                 ← este arquivo
```

---

## 6. Variáveis de ambiente

`.env.local` nunca vai para o Git. `.env.example` vai, com valores vazios.

```bash
# .env.example

# Banco de dados
# Desenvolvimento local (Docker):
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/quimica_dev"
# Produção (Neon):
DATABASE_URL=""

# NextAuth
NEXTAUTH_SECRET=""
NEXTAUTH_URL=""

# Credenciais do professor (admin)
ADMIN_EMAIL=""
ADMIN_PASSWORD_HASH=""
```

### Regras de ambiente

- Nunca hardcode credenciais no código.
- Sempre acessar via `process.env.NOME_DA_VARIAVEL`.
- Em caso de variável ausente, o sistema deve falhar com mensagem clara — nunca com valor padrão silencioso.

---

## 7. Autenticação

Apenas o professor faz login. Alunos acessam tudo publicamente.

### Configuração

- Usar **NextAuth.js** com provider `Credentials` (email + senha).
- A senha do professor é armazenada como hash (bcrypt) em variável de ambiente — não no banco.
- Rotas sob `/admin/*` são protegidas pelo `layout.tsx` da pasta admin, que verifica a sessão.
- API Routes de escrita (POST, PUT, DELETE) verificam a sessão antes de executar.

### Verificação de sessão em API Routes

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const session = await getServerSession(authOptions);
if (!session) {
  return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
}
```

---

## 8. Padrões de código

### Nomenclatura

- Componentes React: `PascalCase` (`AulaCard.tsx`)
- Funções e variáveis: `camelCase` (`buscarAulas`)
- Arquivos que não são componentes: `camelCase` (`prisma.ts`, `auth.ts`)
- Slugs: `kebab-case` (`ligacoes-ionicas`)
- Variáveis de ambiente: `UPPER_SNAKE_CASE`

### Componentes

- Sempre componentes funcionais com TypeScript.
- Props sempre tipadas com `type` (não `interface` para props simples).
- Componentes de servidor (Server Components) por padrão — só usar `"use client"` quando necessário (formulários, hooks de estado, eventos do browser).

```typescript
// Correto
type AulaCardProps = {
  aula: Aula
}

export function AulaCard({ aula }: AulaCardProps) { ... }
```

### API Routes

- Sempre retornar `NextResponse.json()`.
- Sempre tratar erros com try/catch.
- Retornar status HTTP corretos: 200 (ok), 201 (criado), 400 (dados inválidos), 401 (não autenticado), 404 (não encontrado), 500 (erro interno).

```typescript
export async function GET() {
  try {
    const aulas = await prisma.aula.findMany(...)
    return NextResponse.json(aulas)
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar aulas" },
      { status: 500 }
    )
  }
}
```

### Prisma

- Instância única importada de `@/lib/prisma`.
- Nunca instanciar `new PrismaClient()` fora de `lib/prisma.ts`.
- Sempre usar `select` ou `include` explícitos — evitar buscar campos desnecessários.

---

## 9. Visual e estilo

### Identidade visual

- **Cor primária:** azul-escuro (`blue-800` do Tailwind)
- **Cor de destaque:** verde (`green-600` do Tailwind) — referência à química
- **Fundo:** branco (`white`)
- **Tipografia:** fonte `Inter` (Google Fonts)
- **Tom:** simples e funcional — o conteúdo é o produto

### Princípios

- Mobile-first. Todo componente deve funcionar bem em tela pequena.
- Não usar bibliotecas de componentes (shadcn, MUI, Chakra) no MVP — Tailwind puro.
- Não usar animações complexas — transições simples com `transition` do Tailwind são suficientes.
- Acessibilidade básica: sempre usar tags semânticas (`nav`, `main`, `article`, `section`), atributos `alt` em imagens, `aria-label` onde necessário.

---

## 10. Testes (abordagem TDD pragmático)

Este projeto segue **TDD (Test-Driven Development)** com abordagem pragmática.
A ordem de trabalho é sempre: **teste → código → refatoração** (Red → Green → Refactor).

### O ciclo obrigatório

```
1. RED      — escreva o teste. Rode. Ele deve falhar (o código não existe ainda).
2. GREEN    — escreva o mínimo de código para o teste passar.
3. REFACTOR — melhore o código sem quebrar o teste.
```

Nunca pule direto para o código. Se o teste já passar antes de escrever código, o teste está errado.

### Quando aplicar TDD (escrever teste ANTES do código)

Aplicar TDD em tudo que contém **lógica**:

| O que                               | Por quê                                        |
| ----------------------------------- | ---------------------------------------------- |
| API Routes (GET, POST, PUT, DELETE) | Lógica de busca, filtros, validação de dados   |
| Queries Prisma com filtros          | `publicada: true`, ordenação, relações         |
| Funções utilitárias em `lib/`       | Transformação de dados, formatação             |
| Lógica de autenticação              | Segurança — falha silenciosa é inaceitável     |
| Regras de negócio                   | Ex: "aula só aparece se assunto estiver ativo" |

### Quando escrever teste APÓS o código (não TDD)

Componentes puramente visuais com pouca ou nenhuma lógica:

| O que                                             | Abordagem                                 |
| ------------------------------------------------- | ----------------------------------------- |
| Componentes que só exibem dados (AulaCard, Badge) | Teste após, verificar renderização básica |
| Páginas estáticas (página inicial, rodapé)        | Teste após, opcional                      |
| Componentes de layout (Header, Footer)            | Teste após, opcional                      |

### Ferramentas

- `jest` — runner de testes
- `@testing-library/react` — testes de componentes
- `@testing-library/jest-dom` — matchers extras (`toBeInTheDocument`, etc.)
- Rodar todos os testes: `docker compose exec app npm test`
- Rodar em modo watch: `docker compose exec app npm test -- --watch`

### Estrutura dos testes

Testes ficam em `tests/` espelhando a estrutura de `src/`:

```
tests/
├── api/
│   ├── aulas.test.ts         ← testa src/app/api/aulas/route.ts
│   └── assuntos.test.ts
├── lib/
│   └── queries.test.ts       ← testa funções de src/lib/
└── components/
    ├── AulaCard.test.tsx
    └── ArquivoLink.test.tsx
```

### Exemplos do projeto

**TDD — API Route (escrever ANTES do código):**

```typescript
// tests/api/aulas.test.ts
// Este teste é escrito ANTES de criar src/app/api/aulas/route.ts

describe("GET /api/aulas", () => {
  test("retorna apenas aulas publicadas", async () => {
    prismaMock.aula.findMany.mockResolvedValue([aulaPublicadaFake]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].publicada).toBe(true);
  });

  test("retorna 500 se o banco falhar", async () => {
    prismaMock.aula.findMany.mockRejectedValue(new Error("DB error"));

    const response = await GET();
    expect(response.status).toBe(500);
  });
});
```

**Teste após — Componente visual:**

```typescript
// tests/components/AulaCard.test.tsx
test("exibe título e descrição da aula", () => {
  render(<AulaCard aula={aulaFake} />)
  expect(screen.getByText("Ligações Iônicas")).toBeInTheDocument()
  expect(screen.getByText("Transferência de elétrons")).toBeInTheDocument()
})
```

### Regras

- Nunca commitar código com testes falhando.
- O nome do teste descreve o comportamento esperado, não a implementação.
  - Correto: `"retorna apenas aulas publicadas"`
  - Errado: `"chama findMany com where publicada true"`
- Um teste por comportamento — não testar múltiplas coisas no mesmo `test()`.

---

## 11. Git e commits

### Convenção de mensagens (Conventional Commits)

```
feat: adiciona página de listagem de assuntos
fix: corrige link quebrado no ArquivoLink
chore: instala e configura Prisma
docs: atualiza README com instruções de setup
style: ajusta espaçamento do header
test: adiciona testes para AulaCard
refactor: extrai lógica de busca para lib/queries.ts
```

### Regras

- Um commit por mudança lógica — não agrupar coisas não relacionadas.
- Nunca commitar `.env.local`.
- Nunca commitar `node_modules/`.
- Branch principal: `main`. Para funcionalidades novas, criar branch `feat/nome-da-feature`.

---

## 12. Roadmap de desenvolvimento

### MVP (fase atual)

- [ ] Setup do projeto (Next.js, TypeScript, Tailwind)
- [ ] Configurar Docker (Dockerfile + docker-compose.yml)
- [ ] Configuração do Prisma + banco local (Docker)
- [ ] Schema e primeira migration
- [ ] Seed com dados de exemplo
- [ ] Página inicial
- [ ] Listagem de assuntos (`/assuntos`)
- [ ] Página do assunto com aulas (`/assuntos/[slug]`)
- [ ] Página individual da aula (`/assuntos/[slug]/[aulaSlug]`)
- [ ] Header e Footer
- [ ] Deploy na Vercel com Neon funcionando
- [ ] Testes básicos de componentes

### Fase 2 — Painel admin

- [ ] Configuração do NextAuth
- [ ] Login do professor (`/admin/login`)
- [ ] Dashboard admin (`/admin`)
- [ ] CRUD de assuntos
- [ ] CRUD de aulas (criar, editar, publicar/despublicar)
- [ ] Gerenciar arquivos vinculados a uma aula

### Fase 3 — Melhorias (futuro)

- [ ] Busca de conteúdo
- [ ] Feedback/comentários de alunos
- [ ] Migração de arquivos para Cloudflare R2
- [ ] Analytics básico (Vercel Analytics)
- [ ] Modo escuro

---

## 13. Gerenciamento de dependências e conflitos

### Semver — o que significam os números de versão

```
next  14.2.35
       │ │ └─ PATCH — correção de bug, seguro atualizar
       │ └─── MINOR — funcionalidade nova, geralmente seguro
       └───── MAJOR — pode quebrar o código existente
```

### Regra de ouro: sempre instalar com versão exata

```bash
# Correto — salva a versão exata no package.json
npm install next@14.2.35 --save-exact

# Ou configurar o npm para sempre salvar exato (fazer uma vez)
npm config set save-exact true
```

Nunca instalar sem especificar versão (`npm install next`) — o npm vai buscar a última versão disponível, que pode ser incompatível.

### Três arquivos que protegem o projeto

**`package-lock.json`** — gerado automaticamente pelo npm. Registra as versões exatas de todas as dependências. Deve estar sempre no Git. Nunca adicionar ao `.gitignore`.

**`.nvmrc`** — fixa a versão do Node.js. Criar na raiz do projeto:

```bash
node --version > .nvmrc
```

**`.env.example`** — documenta as variáveis de ambiente necessárias sem expor valores reais.

### Compatibilidade entre as dependências principais

| Pacote                 | Versão  | Depende de                        |
| ---------------------- | ------- | --------------------------------- |
| next                   | 14.2.35 | react 18.x, react-dom 18.x        |
| next-auth              | 4.x     | next 14.x                         |
| prisma                 | 5.x     | @prisma/client 5.x (mesma versão) |
| @testing-library/react | 14.x    | react 18.x                        |
| jest                   | 29.x    | —                                 |

**Atenção:** `prisma` e `@prisma/client` devem ter sempre a mesma versão.

### Como resolver conflito de dependências

```bash
# 1. Ver o que está conflitando
npm ls nome-do-pacote

# 2. Tentar resolver automaticamente
npm install --legacy-peer-deps

# 3. Se ainda falhar, consultar o desenvolvedor antes de forçar
```

Nunca usar `--force` sem consultar o desenvolvedor.

### Atualizações de dependências

- Não atualizar dependências sem motivo explícito.
- Antes de atualizar qualquer pacote, rodar os testes para ter baseline.
- Após atualizar, rodar os testes novamente — se quebrar, reverter.
- Atualizações de segurança (`npm audit fix`) são permitidas para patches apenas.

---

## 14. Ambiente de desenvolvimento (Docker)

O ambiente de desenvolvimento usa Docker. Next.js e PostgreSQL rodam em containers.
Em produção, o banco é o Neon — o código não muda, só o `DATABASE_URL`.

### Arquivos de configuração

**`Dockerfile`** — container do Next.js:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

**`docker-compose.yml`** — orquestra Next.js + Postgres:

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/quimica_dev
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: quimica_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

**`.dockerignore`**:

```
node_modules
.next
.env.local
.git
```

### Dois ambientes, um código

| Ambiente                 | DATABASE_URL                                                |
| ------------------------ | ----------------------------------------------------------- |
| Desenvolvimento (Docker) | `postgresql://postgres:postgres@localhost:5432/quimica_dev` |
| Produção (Vercel + Neon) | String de conexão do painel do Neon                         |

### Comandos do dia a dia

```bash
# Subir tudo (primeira vez ou após mudanças no Dockerfile)
docker compose up --build

# Subir sem rebuild
docker compose up

# Rodar migrations dentro do container
docker compose exec app npx prisma migrate dev

# Abrir Prisma Studio
docker compose exec app npx prisma studio

# Rodar testes dentro do container
docker compose exec app npm test

# Rodar seed
docker compose exec app npx prisma db seed

# Parar os containers
docker compose down

# Parar e apagar os dados do banco (reset completo)
docker compose down -v
```

### Regras

- Todos os comandos Prisma e npm devem rodar dentro do container via `docker compose exec app`.
- Nunca rodar `npx prisma migrate dev` diretamente no host — usar sempre o container.
- O volume `postgres_data` persiste os dados entre sessões. Usar `down -v` apenas para reset intencional.
- Não commitar `docker-compose.override.yml` se criado localmente para testes.

---

## 15. O que o agente NÃO deve fazer

- Não escrever código de lógica (API Routes, queries, funções utilitárias) sem escrever o teste antes — seguir o ciclo Red→Green→Refactor da seção 10.
- Não instalar dependências fora da stack definida na seção 2.
- Não criar arquivos CSS separados — usar Tailwind.
- Não usar `any` em TypeScript sem comentário justificando.
- Não remover campos do schema Prisma sem avisar o desenvolvedor.
- Não hardcodar textos de conteúdo de Química no código — conteúdo vem do banco.
- Não criar rotas fora da estrutura definida na seção 5.
- Não usar `console.log` em produção — usar apenas em desenvolvimento e remover antes do commit.
- Não rodar comandos Prisma ou npm diretamente no host — usar `docker compose exec app`.
- Não tomar decisões arquiteturais não previstas neste documento sem consultar o desenvolvedor.

---

## 16. Como pedir ajuda ao agente

Para melhores resultados, formule pedidos assim:

- **Específico:** "Crie o componente `AulaCard` conforme a estrutura definida no AGENTS.md"
- **Incremental:** "Agora adicione o campo `ordem` ao modelo `Aula` e crie a migration"
- **Com contexto:** "Estou na etapa de painel admin. Crie o formulário de criação de aula seguindo os padrões do projeto"

Evite pedidos amplos como "faça o sistema de aulas" — quebre em tarefas pequenas e revise cada uma antes de avançar.

---

_Última atualização: adicionado ambiente Docker (seção 14) e corrigida versão do Next.js para 14.2.35._
