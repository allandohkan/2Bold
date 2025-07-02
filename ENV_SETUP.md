# Configuração de Variáveis de Ambiente

## 🚨 IMPORTANTE: Segurança

Este projeto usa variáveis de ambiente para proteger credenciais sensíveis da API.

## 📁 Arquivo .env

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Credenciais da API Zicard
VITE_API_EMAIL=EXEMPLODEEMAIL
VITE_API_PASSWORD=EXEMPLODESENHA

# URLs da API
VITE_API_BASE_URL=EXEMPLODEURL
```

## ⚠️ ATENÇÃO

1. **NUNCA** commite o arquivo `.env` no Git
2. **SEMPRE** adicione `.env` ao `.gitignore`
3. **MANTENHA** as credenciais seguras

## 🔧 Como Funciona

- O Vite carrega automaticamente o arquivo `.env`
- Variáveis começando com `VITE_` ficam disponíveis no frontend
- O código usa `import.meta.env.VITE_*` para acessar as variáveis

## 🚀 Deploy

Para deploy em produção, configure as variáveis de ambiente no seu provedor:

### Netlify
- Vá em Site settings > Environment variables
- Adicione cada variável

### Vercel
- Vá em Project settings > Environment variables
- Adicione cada variável

### Outros
- Configure as variáveis de ambiente no seu servidor
- Nunca exponha o arquivo `.env` publicamente 