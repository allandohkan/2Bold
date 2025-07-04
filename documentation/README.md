# Documentação do Projeto 2Bold

Esta pasta contém toda a documentação técnica do projeto 2Bold.

## 📚 Documentos Disponíveis

### 🔄 [Sistema de Paginação](./PAGINATION_USAGE.md)
Documentação completa do sistema de paginação genérico implementado no projeto.

**Conteúdo:**
- Componente `Pagination` reutilizável
- Hook `usePagination` para gerenciar lógica
- Exemplos de uso práticos
- Características e vantagens do sistema

**Arquivos relacionados:**
- `src/components/Pagination.jsx`
- `src/hooks/usePagination.js`

### 🔐 [AuthContext - Gerenciamento de Estado](./AUTHCONTEXT_USAGE.md)
Documentação completa do sistema de autenticação e gerenciamento de estado.

**Conteúdo:**
- Fluxo de autenticação multi-etapa
- Gerenciamento de estado global
- Cache de pontos e sincronização
- Persistência criptografada
- Troubleshooting e uso prático

**Arquivos relacionados:**
- `src/contexts/AuthContext.jsx`
- `src/utils/encryption.js`
- `src/services/apiService.js`

## 🏗️ Estrutura do Projeto

```
2Bold/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   ├── pages/              # Páginas da aplicação
│   ├── hooks/              # Hooks personalizados
│   ├── services/           # Serviços e APIs
│   ├── contexts/           # Contextos React
│   └── styles/             # Arquivos de estilo
├── documentation/          # 📁 Documentação técnica
│   ├── README.md           # Este arquivo
│   ├── PAGINATION_USAGE.md # Sistema de paginação
│   └── AUTHCONTEXT_USAGE.md # AuthContext e gerenciamento de estado
└── README.md               # README principal do projeto
```

## 🔍 Encontrando Documentação

- **Funcionalidades**: Procure pelo nome da funcionalidade
- **Componentes**: Verifique se há documentação específica
- **APIs**: Consulte a documentação de serviços relacionados
