# DOCUMENTAÇÃO COMPLETA - BEM ESPECIAL

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Fluxo de Autenticação](#fluxo-de-autenticação)
6. [API e Serviços](#api-e-serviços)
7. [Componentes Principais](#componentes-principais)
8. [Páginas do Sistema](#páginas-do-sistema)
9. [Segurança](#segurança)
10. [Acessibilidade](#acessibilidade)
11. [Deploy e Configuração](#deploy-e-configuração)
12. [Problemas Conhecidos](#problemas-conhecidos)
13. [Manutenção](#manutenção)

---

## 🎯 VISÃO GERAL

**Bem Especial** é um sistema de programa de pontos desenvolvido em React que permite aos usuários:

- **Autenticação segura** com validação de CPF, senha e código de verificação
- **Visualização de pontos** acumulados no programa
- **Resgate de vouchers** de produtos disponíveis
- **Histórico de resgates** e vouchers ativos
- **Redefinição de senha** via e-mail

### Características Principais
- ✅ Autenticação multi-etapa com validação de código
- ✅ Sistema de pontos em tempo real
- ✅ Interface responsiva e acessível
- ✅ Dados criptografados no localStorage
- ✅ Cache inteligente para performance
- ✅ Suporte a múltiplos ambientes de deploy

---

## 🏗️ ARQUITETURA DO SISTEMA

### Padrão de Arquitetura
- **Frontend**: Single Page Application (SPA) com React
- **Estado Global**: Context API + localStorage criptografado
- **Roteamento**: React Router v7 com proteção de rotas
- **Estilização**: Tailwind CSS + SCSS
- **Build**: Vite para desenvolvimento e produção

### Fluxo de Dados
```
Usuário → Componentes → Context API → API Service → Backend API
                ↓
        localStorage (criptografado)
```

---

## 🛠️ TECNOLOGIAS UTILIZADAS

### Core
- **React 19.1.0** - Framework principal
- **React Router DOM 7.6.2** - Roteamento
- **Vite 6.3.5** - Build tool e dev server

### Estilização
- **Tailwind CSS 4.1.10** - Framework CSS utilitário
- **SCSS/Sass 1.89.2** - Pré-processador CSS
- **Lucide React 0.511.0** - Ícones

### Funcionalidades
- **CryptoJS 4.2.0** - Criptografia de dados
- **React Slick 0.30.3** - Carrossel de imagens
- **Prop Types 15.8.1** - Validação de props

### Desenvolvimento
- **ESLint 9.25.0** - Linting
- **Cross-env 7.0.3** - Variáveis de ambiente cross-platform
- **GH Pages 6.3.0** - Deploy no GitHub Pages

---

## 📁 ESTRUTURA DO PROJETO

```
2Bold/
├── src/
│   ├── components/           # Componentes reutilizáveis
│   │   ├── Login/           # Componentes específicos do login
│   │   │   ├── CPFValidation.jsx
│   │   │   ├── PasswordValidation.jsx
│   │   │   └── SecurityCodeForm.jsx
│   │   ├── Banner.jsx
│   │   ├── Carousel.jsx
│   │   ├── Modal.jsx
│   │   ├── MyPointsTable.jsx
│   │   ├── Pagination.jsx
│   │   ├── VoucherDisplay.jsx
│   │   └── PageTitle.jsx
│   ├── contexts/            # Context API
│   │   └── AuthContext.jsx  # Gerenciamento de autenticação
│   ├── hooks/               # Custom hooks
│   │   └── usePagination.js
│   ├── layouts/             # Layouts da aplicação
│   │   └── Containers/
│   │       ├── DefaultPageContainer.jsx
│   │       ├── Footer.jsx
│   │       └── Header.jsx
│   ├── pages/               # Páginas da aplicação
│   │   ├── Home.jsx
│   │   ├── LoginPage.jsx
│   │   ├── MyPointsPage.jsx
│   │   ├── ProductListPage.jsx
│   │   ├── ResetPasswordPage.jsx
│   │   ├── SingleProduct.jsx
│   │   └── VouchersPage.jsx
│   ├── services/            # Serviços externos
│   │   └── apiService.js    # Comunicação com API
│   ├── styles/              # Estilos SCSS
│   │   ├── abstracts/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── global.scss
│   │   └── main.scss
│   ├── utils/               # Utilitários
│   │   └── encryption.js    # Criptografia de dados
│   ├── assets/              # Recursos estáticos
│   │   ├── icons/
│   │   └── images/
│   ├── App.jsx              # Componente principal
│   ├── main.jsx             # Entry point
│   ├── index.css
│   └── App.css
├── public/                  # Arquivos públicos
├── documentation/           # Documentação
├── api/                     # Funções serverless (Vercel)
├── vercel.json             # Configuração Vercel
├── vite.config.js          # Configuração Vite
├── tailwind.config.cjs     # Configuração Tailwind
├── package.json
└── README.md
```

---

## 🔐 FLUXO DE AUTENTICAÇÃO

### Etapas do Login
1. **Validação de CPF** - Verifica se o CPF existe no sistema
2. **Cadastro/Validação de Senha** - Cria ou valida senha do usuário
3. **Validação de Código** - Código enviado por e-mail para confirmação
4. **Autenticação Completa** - Acesso ao sistema

### Estados de Autenticação
- `cpf` - Tela inicial de CPF
- `password` - Tela de senha
- `code` - Tela de validação de código
- `authenticated` - Usuário autenticado

### Persistência de Dados
- **localStorage criptografado** para dados do usuário
- **Cache de pontos** com expiração de 5 minutos
- **Sincronização automática** entre abas

---

## 🌐 API E SERVIÇOS

### Configuração da API
```javascript
const API_BASE_URL = 'http://k8s-dclube-producao-17f651f37d-680923557.sa-east-1.elb.amazonaws.com';
const AUTH_URL = `${API_BASE_URL}/geral/autenticacao`;
const ACTION_URL = `${API_BASE_URL}/geral/action`;
```

### Endpoints Principais
- **Autenticação**: `POST /geral/autenticacao`
- **Ações**: `POST /geral/action`

### Métodos da API
- `consultarCPF(cpf)` - Valida CPF do usuário
- `cadastrarSenha(idparticipante, senha, confirmasenha)` - Cria senha
- `validarCodigo(idparticipante, codigovalidacao)` - Valida código
- `reenviarCodigo(idparticipante)` - Reenvia código
- `autenticarUsuario(idparticipante, senha)` - Login final
- `consultarSaldo(idparticipante)` - Consulta pontos
- `listarProdutos(idparticipante)` - Lista produtos disponíveis
- `meusPontos(idparticipante)` - Histórico de pontos
- `meusVouchers(idparticipante)` - Vouchers ativos
- `resgatarVoucher(idparticipante, idproduto, qtde)` - Resgate

### Autenticação da API
- **Token-based** com expiração de 24 horas
- **Retry automático** em caso de falha
- **Timeout** de 15 segundos por requisição

---

## 🧩 COMPONENTES PRINCIPAIS

### AuthContext
**Localização**: `src/contexts/AuthContext.jsx`
**Responsabilidade**: Gerenciamento global de autenticação

**Funcionalidades**:
- Estado de autenticação do usuário
- Cache de pontos com expiração
- Sincronização entre abas
- Persistência criptografada

### ApiService
**Localização**: `src/services/apiService.js`
**Responsabilidade**: Comunicação com backend

**Características**:
- Autenticação automática com token
- Retry em caso de falha
- Timeout configurável
- Tratamento de erros

### Componentes de Login
- **CPFValidation**: Validação inicial de CPF
- **PasswordValidation**: Cadastro/validação de senha
- **SecurityCodeForm**: Validação de código por e-mail

### Componentes de Interface
- **MyPointsTable**: Tabela de pontos com paginação
- **VoucherDisplay**: Exibição de vouchers com paginação
- **Carousel**: Carrossel de imagens
- **Modal**: Modal reutilizável
- **Pagination**: Paginação customizada

---

## 📄 PÁGINAS DO SISTEMA

### LoginPage
**Rota**: `/login`
**Funcionalidade**: Fluxo completo de autenticação
**Componentes**: CPFValidation, PasswordValidation, SecurityCodeForm

### Home
**Rota**: `/`
**Funcionalidade**: Dashboard principal
**Características**: Banner, carrossel, navegação

### MyPointsPage
**Rota**: `/meus-pontos`
**Funcionalidade**: Visualização de pontos
**Componentes**: MyPointsTable, Pagination

### ProductListPage
**Rota**: `/resgatar`
**Funcionalidade**: Lista de produtos para resgate
**Características**: Filtros, paginação, busca

### SingleProduct
**Rota**: `/produto/:nome`
**Funcionalidade**: Detalhes do produto e resgate
**Características**: Imagens, descrição, formulário de resgate

### VouchersPage
**Rota**: `/vouchers`
**Funcionalidade**: Vouchers ativos do usuário
**Componentes**: VoucherDisplay

### ResetPasswordPage
**Rota**: `/reset-password`
**Funcionalidade**: Redefinição de senha
**Características**: Formulário de e-mail

---

## 🔒 SEGURANÇA

### Criptografia de Dados
**Arquivo**: `src/utils/encryption.js`
**Método**: AES-256 com chave baseada em domínio + sessionId

```javascript
// Chave única por sessão
const secretKey = CryptoJS.SHA256(`${domain}-${sessionId}-bem-especial-2024`);
```

### Proteção de Rotas
- **PrivateRoute**: Componente que protege rotas autenticadas
- **Redirecionamento automático** para login
- **Verificação de autenticação completa**

### Validação de Inputs
- **CPF**: Validação de formato e dígitos verificadores
- **Senha**: Requisitos mínimos de segurança
- **Código**: Validação de formato

### Variáveis de Ambiente
```env
VITE_API_EMAIL=seu-email@exemplo.com
VITE_API_PASSWORD=sua-senha
```

---

## ♿ ACESSIBILIDADE

### Implementações
- **Skip links** para navegação por teclado
- **ARIA labels** em formulários e botões
- **Roles semânticos** nos elementos
- **Navegação por teclado** completa
- **Contraste adequado** de cores
- **Estrutura semântica** HTML

### Melhorias Implementadas
- `lang="pt-BR"` no HTML
- `role="main"` no conteúdo principal
- `aria-label` em campos de formulário
- `aria-describedby` para descrições
- `tabIndex` para navegação

---

## 🚀 DEPLOY E CONFIGURAÇÃO

### Scripts Disponíveis
```bash
npm run dev              # Desenvolvimento local
npm run build            # Build para produção
npm run build:gh-pages   # Build para GitHub Pages (Não funcional)
npm run build:production # Build para produção
npm run deploy           # Deploy no GitHub Pages
npm run preview          # Preview do build
```

### Configuração Vercel (Usado apenas para testes)
**Arquivo**: `vercel.json`
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### Configuração Vite
**Arquivo**: `vite.config.js`
```javascript
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()]
})
```

### Ambientes de Deploy
1. **Desenvolvimento**: `npm run dev`
2. **GitHub Pages**: `npm run deploy`
3. **Vercel**: Deploy automático via Git
4. **Outros servidores**: `npm run build:production`

---

## ⚠️ PROBLEMAS CONHECIDOS

### Mixed Content Error
**Problema**: API só responde em HTTP, mas o site está em HTTPS
**Status**: Aguardando implementação de HTTPS na API
**Impacto**: Login não funciona em produção

**Solução Temporária**: 
- Desenvolvimento local funciona (HTTP)
- Produção requer HTTPS na API

---

## 🔧 MANUTENÇÃO

### Atualizações de Dependências
```bash
npm update              # Atualiza dependências
npm audit fix          # Corrige vulnerabilidades
npm run lint           # Verifica código
```

### Monitoramento
- **Console logs** para debug de API
- **Network tab** para requisições
- **Application tab** para localStorage

### Backup e Recuperação
- **Dados do usuário**: Criptografados no localStorage
- **Configurações**: Variáveis de ambiente
- **Código**: Versionado no Git

### Performance
- **Lazy loading** de componentes
- **Cache de pontos** com expiração
- **Otimização de imagens** (WebP quando possível)
- **Code splitting** automático do Vite

---

## 📞 SUPORTE

### Contatos
- **Desenvolvedor**: Allan Dohkan
- **Repositório**: https://github.com/allandohkan/2Bold
- **Deploy**: https://epharma-ten.vercel.app

---

**Versão da Documentação**: 1.0  
**Última Atualização**: Julho de 2025 
**Projeto**: Bem Especial - Programa de Pontos 