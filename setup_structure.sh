#!/bin/bash
# Script para criar a estrutura de pastas conforme definido em AGENTS.md

echo "Criando estrutura de pastas..."

# 1. Pastas da Raiz
mkdir -p prisma/migrations
mkdir -p public/images

# 2. Estrutura de Testes
mkdir -p tests/components
mkdir -p tests/api

# 3. Src - App (Rotas)
mkdir -p src/app/assuntos/[slug]/[aulaSlug]
mkdir -p src/app/admin/aulas/nova
mkdir -p src/app/admin/aulas/[id]
mkdir -p src/app/admin/assuntos

# 4. Src - API Routes
mkdir -p src/app/api/auth/[...nextauth]
mkdir -p src/app/api/aulas
mkdir -p src/app/api/assuntos

# 5. Src - Componentes e Utilitários
mkdir -p src/components/layout
mkdir -p src/components/aulas
mkdir -p src/components/ui
mkdir -p src/lib
mkdir -p src/types

echo "Estrutura criada com sucesso!"
chmod +x setup_structure.sh