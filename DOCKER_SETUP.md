# Guia de Setup e Uso do Docker

Este guia explica como configurar e gerenciar o ambiente de desenvolvimento Docker para este projeto.

## 1. Pré-requisitos

- Docker e Docker Compose (ou Podman e `podman-compose`) instalados na sua máquina.

## 2. Configuração Inicial (Primeira vez)

Siga estes passos ao clonar o projeto pela primeira vez ou após uma grande alteração na configuração.

### Passo 1: Construir e Subir os Containers

Este comando irá construir a imagem do Next.js (instalando as dependências do `package.json`) e subir os containers da aplicação (`app`) e do banco de dados (`db`) em segundo plano.

```bash
npm run docker:build
```

### Passo 2: Rodar as Migrações e Popular o Banco

Com os containers rodando, precisamos criar as tabelas e inserir os dados iniciais.

1.  **Criar as tabelas (Migrations):**

    ```bash
    npm run docker:prisma:migrate
    ```

    _O Prisma pode pedir um nome para a migration, você pode apenas pressionar Enter._

2.  **Popular o banco com dados de exemplo (Seed):**
    ```bash
    npm run docker:prisma:seed
    ```

### Passo 3: Acessar a Aplicação

Se tudo correu bem, você pode acessar:

- **Site:** http://localhost:3000
- **Prisma Studio (para ver o banco):** http://localhost:5555

## 3. Uso Diário (Reboot do Ambiente)

Para o dia a dia, você não precisa reconstruir a imagem toda vez.

- **Para iniciar o ambiente:**

  ```bash
  npm run docker:up
  ```

- **Para parar o ambiente:**
  ```bash
  npm run docker:down
  ```

## 4. Solução de Problemas e Comandos Úteis

### Instalando Novas Dependências

Nunca rode `npm install` diretamente no seu computador. Use o comando `docker compose exec` para instalar dentro do container e manter o `package-lock.json` sincronizado.

```bash
# Exemplo: instalando a biblioteca 'zod'
docker compose exec app npm install zod
```

### Erros de Permissão ou "Lockfile" Desatualizado

Se você encontrar erros como `EACCES: permission denied` ou `Failed to patch lockfile`, significa que há um conflito de permissões ou de `package-lock.json` entre seu computador (host) e o container.

A solução é limpar tudo e reconstruir:

```bash
# 1. Derruba os containers e apaga os volumes antigos (limpeza total)
npm run docker:clean

# 2. Reconstrói a imagem e sobe o ambiente
npm run docker:build
```

### Conflito de Porta (Erro `address already in use`)

Se você receber um erro informando que a porta `5432` já está em uso, significa que você tem outro serviço (provavelmente um PostgreSQL local) rodando.

O `docker-compose.yml` deste projeto já está configurado para usar a porta **`5433`** no seu computador, evitando esse conflito. Se precisar conectar ao banco de dados do Docker com um cliente externo (DBeaver, TablePlus, etc.), use `localhost:5433`.

## 5. Gerenciamento do Banco de Dados

### Atualizando o Schema (Criar Migrations)

Sempre que você alterar o arquivo `prisma/schema.prisma` (ex: adicionar uma tabela ou campo), siga estes passos:

1.  Faça as alterações no arquivo.
2.  Rode o comando para criar a migration e atualizar o banco local:
    ```bash
    npm run docker:prisma:migrate
    ```

### Acessando o Banco Local (Ferramentas Externas)

Para "ligar" uma ferramenta visual (como DBeaver ou TablePlus) ao banco de dados do Docker:

- **Host:** `localhost`
- **Porta:** `5433` (Usamos esta porta para não conflitar com instalações locais)
- **Usuário:** `postgres`
- **Senha:** `postgres`
- **Database:** `quimica_dev`

### Atualizando o Banco de Produção (Neon)

Para aplicar as suas migrations no banco de dados online (Neon):

```bash
# Substitua a URL abaixo pela sua string de conexão real do Neon
docker compose exec -e DATABASE_URL="postgresql://user:pass@host/db?sslmode=require" app npx prisma migrate deploy
```
