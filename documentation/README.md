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

### 🔐 [Redefinição de Senha](./REDEFINICAO_SENHA.md)
Documentação da funcionalidade de redefinição de senha.

**Conteúdo:**
- Fluxo completo de redefinição
- URLs e endpoints da API
- Requisitos de segurança
- Integração com e-mail

**Arquivos relacionados:**
- `src/pages/ResetPasswordPage.jsx`
- `src/components/Login/SecurityCodeForm.jsx`
- `src/components/Login/PasswordValidation.jsx`

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
│   └── REDEFINICAO_SENHA.md # Redefinição de senha
└── README.md               # README principal do projeto
```

## 📝 Como Contribuir com a Documentação

1. **Criar novo documento**: Adicione arquivos `.md` nesta pasta
2. **Atualizar documentação**: Mantenha os documentos sincronizados com o código
3. **Organização**: Use nomes descritivos e estrutura clara
4. **Exemplos**: Sempre inclua exemplos práticos de uso

## 🔍 Encontrando Documentação

- **Funcionalidades**: Procure pelo nome da funcionalidade
- **Componentes**: Verifique se há documentação específica
- **APIs**: Consulte a documentação de serviços relacionados

## 📞 Suporte

Para dúvidas sobre a documentação ou implementação:
- Verifique os exemplos nos documentos
- Consulte os arquivos de código relacionados
- Revise a estrutura do projeto

---

*Última atualização: Janeiro 2025* 