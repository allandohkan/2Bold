# Bem Especial - Programa de Pontos

Sistema de login e gerenciamento de pontos para o programa Bem Especial.

## 📚 Documentação

### **📖 [Documentação Completa](./documentation/README.md)**
Documentação técnica detalhada do projeto, incluindo:
- Sistema de paginação
- Estrutura do projeto
- Como contribuir

### **🔄 [Sistema de Paginação](./documentation/PAGINATION_USAGE.md)**
Documentação completa do sistema de paginação genérico:
- Componente `Pagination` reutilizável
- Hook `usePagination` para gerenciar lógica
- Exemplos de uso práticos

### **🔐 [AuthContext - Gerenciamento de Estado](./documentation/AUTHCONTEXT_USAGE.md)**
Guia completo sobre o sistema de autenticação:
- Fluxo de autenticação multi-etapa
- Gerenciamento de estado global
- Cache de pontos e sincronização
- Persistência criptografada

## 🚀 Deploy

### **GitHub Pages:**
```bash
npm run deploy
```
- URL: `https://[usuario].github.io/2Bold/`

### **Produção (outros servidores):**
```bash
npm run build:production
```
- Base URL: `/` (raiz do domínio)
- URL: `https://meusite.com/`

### **Desenvolvimento:**
```bash
npm run dev
```

## 📋 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Desenvolvimento local |
| `npm run build` | Build para produção (base: /) |
| `npm run build:gh-pages` | Build para GitHub Pages (base: /2Bold/) |
| `npm run build:production` | Build para produção (base: /) |
| `npm run deploy` | Deploy no GitHub Pages |
| `npm run preview` | Preview do build |

## 🔧 Configuração

### **Variáveis de Ambiente (.env):**
```env
VITE_API_BASE_URL=https://api.exemplo.com
VITE_API_EMAIL=seu-email@exemplo.com
VITE_API_PASSWORD=sua-senha
```

## 🛡️ Segurança

- ✅ Dados criptografados no localStorage
- ✅ Variáveis de ambiente protegidas
- ✅ Validação de inputs
- ✅ HTTPS obrigatório

## ♿ Acessibilidade

- ✅ Navegação por teclado
- ✅ Screen readers
- ✅ ARIA labels
- ✅ Skip links
- ✅ Estrutura semântica 