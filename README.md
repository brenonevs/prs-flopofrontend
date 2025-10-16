# Guia de Configuração - Frontend (Next.js + React + TailwindCSS)

## 📋 Visão Geral do Frontend

### Descrição
O frontend é uma aplicação web  construída com **Next.js 15** e **React 19** que oferece uma interface para gerenciar regras de anonimização de documentos. A aplicação apresenta dashboards interativos, tabelas de dados organizadas hierarquicamente e formulários para configuração de regras.

### Tecnologias Principais
- **Next.js 15** 
- **React 19**
- **TailwindCSS 4**
- **TypeScript**
- **Radix UI**
- **Lucide React**
- **Recharts**
- **React Table**

### Arquitetura do Frontend
```
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── page.tsx           # Dashboard principal
│   │   ├── configuracao/      # Página de configuração
│   │   ├── relatorios/        # Página de relatórios
│   │   └── layout.tsx         # Layout principal
│   ├── components/            # Componentes reutilizáveis
│   │   ├── ui/               # Componentes base (Shadcn/UI)
│   │   ├── dashboard/        # Componentes do dashboard
│   │   ├── tables/           # Tabelas de dados
│   │   └── filters/          # Filtros e buscas
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utilitários e configurações
│   └── types/                # Definições TypeScript
├── public/                   # Arquivos estáticos
└── styles/                   # Estilos globais
```

### Funcionalidades Principais
- **Dashboard Interativo** - Visão geral das regras e estatísticas
- **Configuração de Regras** - Interface para definir regras de anonimização
- **Tabelas Hierárquicas** - Visualização de classes, tipos e rótulos
- **Relatórios Visuais** - Gráficos e análises das configurações
- **Interface Responsiva** - Adaptada para desktop e mobile
- **Tema Dark/Light** - Alternância de temas

## 🔧 Pré-requisitos do Frontend

### Ferramentas Obrigatórias

| Ferramenta | Versão Mínima | Versão Recomendada | Como Verificar |
|------------|---------------|-------------------|----------------|
| **Node.js** | 18.17.0 | 20.x LTS | `node --version` |
| **npm** | 9.0.0 | 10.x | `npm --version` |

### Instalação das Dependências

#### Node.js (LTS)
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Windows
# Baixar de: https://nodejs.org/
# Ou via Chocolatey: choco install nodejs

# macOS
brew install node
```

### Verificação da Instalação
```bash
node --version    # Deve retornar v18.17.0 ou superior
npm --version     # Deve retornar 9.x.x ou superior
```

## ⚙️ Configuração de Ambiente do Frontend

### Arquivo .env.local

**Localização:** `frontend/.env.local`

```env
# API - Configuração de comunicação com backend
NEXT_PUBLIC_API_URL=http://localhost:3001

# DATA - Modo de dados para desenvolvimento
NEXT_PUBLIC_USE_MOCK_DATA=false
```

### Descrição Detalhada das Variáveis

#### NEXT_PUBLIC_API_URL
- **Obrigatória**: ✅ Sim
- **Descrição**: URL base da API backend para comunicação
- **Formato**: `http://host:port`
- **Prefixo**: `NEXT_PUBLIC_` torna a variável disponível no browser
- **Exemplos**:
  ```env
  # Desenvolvimento local
  NEXT_PUBLIC_API_URL=http://localhost:3001
  
  # Backend em porta diferente
  NEXT_PUBLIC_API_URL=http://localhost:8080
  
  # Desenvolvimento em rede local
  NEXT_PUBLIC_API_URL=http://localhost:3001
  ```

#### NEXT_PUBLIC_USE_MOCK_DATA
- **Obrigatória**: ❌ Não (padrão: false)
- **Descrição**: Define se deve usar dados mockados ao invés da API real
- **Valores válidos**: `true`, `false`
- **Uso**: Desenvolvimento offline ou quando backend não está disponível
- **Exemplos**:
  ```env
  # Usar API real (recomendado)
  NEXT_PUBLIC_USE_MOCK_DATA=false
  
  # Usar dados mockados (desenvolvimento offline)
  NEXT_PUBLIC_USE_MOCK_DATA=true
  ```

### Configurações Adicionais (Opcionais)

#### Variáveis de Debug
```env
# Debug do Next.js (opcional)
DEBUG=*
NEXT_DEBUG=true

# Configurações de desenvolvimento (opcional)
ANALYZE=true
```

### Criando o Arquivo .env.local
```bash
# Criar .env
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_USE_MOCK_DATA=false
EOF
```

### Verificação das Variáveis
```bash
# Verificar se arquivo existe
ls -la .env.local

# Verificar conteúdo
cat .env.local

# Testar se variáveis são carregadas (após npm run dev)
# No browser console: console.log(process.env.NEXT_PUBLIC_API_URL)
```

## 📦 Instalação e Configuração

### 1. Instalação de Dependências

```bash
# Instalar dependências
npm install

# Verificar instalação (listagem resumida)
npm list --depth=0
```

### Dependências Principais Instaladas
```json
{
  "dependencies": {
    "next": "15.5.5",              // Framework React
    "react": "19.1.0",             // Biblioteca React
    "react-dom": "19.1.0",         // React DOM
    "typescript": "^5",            // TypeScript
    "@radix-ui/*": "^1.x",         // Componentes UI acessíveis
    "lucide-react": "^0.545.0",    // Ícones
    "tailwindcss": "^4",           // CSS Framework
    "recharts": "^2.15.4",         // Gráficos
    "@tanstack/react-table": "^8.21.3"  // Tabelas avançadas
  }
}
```


## 🚀 Execução do Frontend

### Scripts Disponíveis

#### Desenvolvimento
```bash
# Servidor desenvolvimento (com Turbopack)
npm run dev

# Verificar se está rodando
curl http://localhost:3000
```

#### Análise e Debug
```bash
# Linting
npm run lint

# Análise de bundle para desenvolvimento (se configurado)
ANALYZE=true npm run dev
```

### Ordem de Execução Recomendada

#### Primeira Execução
```bash
# 1. Verificar pré-requisitos
node --version  # v18.17.0+
npm --version   # 9.0.0+

# 2. Verificar se backend está rodando
curl http://localhost:3001
# Se não estiver, seguir guia do backend primeiro

# 3. Instalar dependências
npm install

# 4. Iniciar servidor
npm run dev
```

#### Execução Diária
```bash
# Verificar se backend está rodando
curl -I http://localhost:3001

# Iniciar frontend
npm run dev
```

### URLs e Acessos

#### Aplicação Frontend
- **URL Principal**: http://localhost:3000
- **Dashboard**: http://localhost:3000/ (página inicial)
- **Relatórios**: http://localhost:3000/relatorios

## 🔧 Troubleshooting do Frontend

### Problemas Comuns

#### 1. Porta 3000 em Uso
**Sintoma**: `EADDRINUSE: address already in use :::3000`

```bash
# Identificar processo usando a porta
lsof -i :3000
# ou
netstat -tlnp | grep :3000

# Matar processo específico
kill -9 <PID>

# Ou usar porta alternativa
PORT=3001 npm run dev
```

#### 2. Erro de Comunicação com Backend
**Sintoma**: `Failed to fetch` ou `Network Error`

```bash
# Verificar se backend está rodando
curl http://localhost:3001

# Verificar variável de ambiente
cat .env.local | grep NEXT_PUBLIC_API_URL

# Testar no browser console
fetch('http://localhost:3001/api/classes')
  .then(r => r.json())
  .then(console.log)
```

#### 3. Dependências Não Instaladas
**Sintoma**: `Module not found` ou `Cannot resolve module`

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json .next
npm install

# Verificar versão do Node
node --version  # Deve ser 18.17.0+

# Verificar se está no diretório correto
pwd  # Deve terminar em /frontend
ls package.json  # Deve existir
```

#### 4. Erro de Build/Compilação TypeScript
**Sintoma**: `Type error` ou `TS2xxx`

```bash
# Verificar erros específicos durante desenvolvimento
npm run dev 2>&1 | grep error

# Executar TypeScript check
npx tsc --noEmit

# Verificar arquivos de tipo
ls -la src/types/
```

#### 5. Problemas de Hot Reload
**Sintoma**: Mudanças não refletem automaticamente

```bash
# Reiniciar servidor dev
Ctrl+C
npm run dev

# Limpar cache do Next.js
rm -rf .next
npm run dev

# Verificar se arquivos estão sendo watched
ls -la src/  # Verificar timestamps
```

#### 6. Erro de Hydration
**Sintoma**: `Hydration failed` ou `Text content does not match`

```bash
# Verificar console do browser
# Geralmente causado por:
# - Conteúdo diferente entre server/client
# - Dados assíncronos não tratados
# - Componentes que dependem de localStorage/sessionStorage

# Solução: usar useEffect para dados client-side
```

### Comandos de Diagnóstico

#### Verificar Status Geral
```bash
# Versões das ferramentas
node --version
npm --version

# Status do servidor
curl -I http://localhost:3000

# Verificar processo Node
ps aux | grep node

# Verificar variáveis de ambiente
printenv | grep NEXT_PUBLIC
```

#### Debug do Next.js
```bash
# Executar com debug detalhado
DEBUG=* npm run dev

# Verificar informações de desenvolvimento
npm run dev -- --debug

# Analisar bundle durante desenvolvimento
ANALYZE=true npm run dev
```

#### Verificar Comunicação com Backend
```bash
# Teste direto da API
curl http://localhost:3001/api/classes

# Teste no browser
# Console: fetch(process.env.NEXT_PUBLIC_API_URL + '/api/classes')
```

### Logs e Debugging

#### Logs do Servidor de Desenvolvimento
```bash
# Logs aparecem no terminal onde executou npm run dev
# Tipos de logs:
✅ Ready - Server started
🔄 Compiling - Building pages
✅ Compiled - Build successful
❌ Failed to compile - Build errors
```

#### Debug no Browser
```javascript
// Console do browser
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
console.log('Mock Data:', process.env.NEXT_PUBLIC_USE_MOCK_DATA)

// Verificar se variáveis estão carregadas
Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC'))
```

## ✅ Checklist do Frontend

### Pré-requisitos ✓
- [ ] Node.js 18.17.0+ instalado e funcionando
- [ ] Porta 3000 livre ou alternativa disponível
- [ ] Backend rodando em http://localhost:3001
- [ ] Arquivo `frontend/.env.local` configurado

### Configuração ✓
- [ ] Dependências instaladas (`npm install`)
- [ ] Variáveis de ambiente carregadas
- [ ] Estrutura de pastas intacta
- [ ] TailwindCSS funcionando

### Execução ✓
- [ ] Servidor iniciado (`npm run dev`)
- [ ] Aplicação carregando em http://localhost:3000
- [ ] Navegação entre páginas funcionando
- [ ] Comunicação com backend estabelecida

### Interface ✓
- [ ] Dashboard principal carregando
- [ ] Página de configuração acessível
- [ ] Página de relatórios acessível
- [ ] Componentes renderizando corretamente
- [ ] Responsividade funcionando

### Validação Final ✓

#### Testes de Conectividade
```bash
# Frontend respondendo
curl -I http://localhost:3000
# Esperado: HTTP/1.1 200 OK

# Comunicação com backend
# No console do browser:
fetch(process.env.NEXT_PUBLIC_API_URL + '/api/classes')
  .then(r => r.json())
  .then(console.log)
# Esperado: Array com dados das classes
```

#### Testes de Interface
- [ ] **Dashboard**: Cards de estatísticas aparecem
- [ ] **Navegação**: Menu lateral funciona
- [ ] **Configuração**: Tabelas carregam dados
- [ ] **Relatórios**: Gráficos são exibidos
- [ ] **Responsivo**: Interface adapta em mobile

#### Testes de Funcionalidade
```bash
# No console do browser:
# 1. Verificar variáveis de ambiente
console.log(process.env.NEXT_PUBLIC_API_URL)

# 2. Testar comunicação
fetch('/api/classes').then(r => console.log(r.status))

# 3. Verificar hot reload
# Alterar qualquer arquivo .tsx e verificar se atualiza automaticamente
```

### Comandos de Validação Rápida
```bash
echo "=== Frontend Health Check ==="
echo "Node.js: $(node --version)"
echo "Frontend: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000)"
echo "Backend API: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:3001)"
echo "Env Variables: $(cat .env.local | wc -l) lines"
```

## 🎯 Funcionalidades Específicas

### Dashboard Interativo
- **Overview Cards**: Estatísticas gerais do sistema
- **Hierarchy Overview**: Visualização da estrutura hierárquica
- **Charts**: Gráficos de distribuição e tendências
- **Quick Actions**: Ações rápidas de navegação

### Configuração de Regras
- **Tabelas Hierárquicas**: Classes → Tipos → Rótulos
- **Filtros Avançados**: Busca e filtros por múltiplos critérios
- **Edição Inline**: Alteração de regras diretamente nas tabelas
- **Validação**: Verificação de regras hierárquicas

### Interface Responsiva
- **Desktop**: Layout completo com sidebar
- **Tablet**: Layout adaptado com menu colapsável
- **Mobile**: Layout vertical otimizado

---

## 📞 Suporte Frontend

### Estrutura de Arquivos Importantes
```
frontend/
├── .env.local              # Configurações de ambiente
├── package.json            # Dependências e scripts
├── next.config.js          # Configuração do Next.js
├── tailwind.config.js      # Configuração do Tailwind
├── src/
│   ├── app/               # App Router (páginas)
│   ├── components/        # Componentes React
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilitários
│   └── types/             # Tipos TypeScript
└── public/                # Arquivos estáticos
```

### Informações Técnicas
- **Framework**: Next.js 15
- **React**: v19.1.0
- **CSS**: TailwindCSS 4
- **Porta padrão**: 3000
- **Linguagem**: TypeScript

### URLs Úteis
- **Aplicação**: http://localhost:3000
- **Dashboard**: http://localhost:3000/
- **Configuração**: http://localhost:3000/configuracao
- **Relatórios**: http://localhost:3000/relatorios

### Recursos Externos
- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev/
- **TailwindCSS**: https://tailwindcss.com/docs
- **Radix UI**: https://www.radix-ui.com/