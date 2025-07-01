# Redefinição de Senha - Bem Especial

## Visão Geral

A funcionalidade de redefinição de senha foi implementada e está disponível através de uma URL dedicada. Esta funcionalidade permite que os usuários redefinam suas senhas de forma segura através de um link enviado por e-mail.

## URLs Disponíveis

### URL Principal
```
https://seu-dominio.com/reset-password
```

### URL com Hash (Gerada pela API)
```
https://seu-dominio.com/reset-password?cdp=HASH-USUARIO
```

## Fluxo de Redefinição (Atualizado)

1. **Página Inicial**: Usuário acessa a URL de redefinição
2. **Inserção de E-mail**: Usuário digita seu e-mail cadastrado
3. **Envio de Email**: Sistema envia email com link de segurança
4. **Clique no Link**: Usuário clica no link do email (contém hash)
5. **Nova Senha**: Usuário cria uma nova senha seguindo os requisitos
6. **Confirmação**: Usuário confirma a nova senha
7. **Redirecionamento**: Usuário é redirecionado para a página de login

## Requisitos da Senha

A nova senha deve conter:
- Mínimo de 6 caracteres
- Pelo menos 1 letra maiúscula
- Pelo menos 1 letra minúscula
- Pelo menos 1 número
- Pelo menos 1 caractere especial (!@#$%^&*...)

## Integração com API

### Endpoints Utilizados

1. **Enviar Email de Redefinição**
   - Action: `ResetSenha`
   - Parâmetros: `{ email }`

2. **Redefinir Senha**
   - Action: `RedefinirSenha`
   - Parâmetros: `{ hash, novaSenha, confirmarSenha }`

### Exemplo de Uso para E-mail

A API gera automaticamente o email com o link. O link terá o formato:

```html
<a href="https://seu-dominio.com/reset-password?cdp=HASH-GERADO-PELA-API">
  Redefinir Senha
</a>
```

## Funcionalidades

- ✅ Interface responsiva
- ✅ Validação de e-mail
- ✅ Link de segurança com hash único
- ✅ Reenvio de email
- ✅ Validação de requisitos da senha
- ✅ Confirmação de senha
- ✅ Tratamento de erros
- ✅ Redirecionamento automático após sucesso

## Segurança

- Hash único por usuário com prazo de validade
- Validação de requisitos de senha forte
- Confirmação de senha obrigatória
- Tratamento seguro de erros (não expõe informações sensíveis)
- Link seguro com parâmetro `cdp` (hash)

## Compatibilidade

- ✅ Desktop
- ✅ Mobile
- ✅ Todos os navegadores modernos
- ✅ React Router v6
- ✅ API REST

## Notas Técnicas

- A página é independente do sistema de autenticação principal
- Utiliza os mesmos componentes visuais do login
- Integração completa com a API existente
- Suporte a parâmetro `cdp` na URL para validação automática
- Fluxo simplificado: Email → Link → Nova Senha

## Mudanças Implementadas

### APIs Atualizadas
- `EnviarCodigoRedefinicao` → `ResetSenha`
- `ValidarCodigoRedefinicao` → Removido (não necessário)
- `RedefinirSenha` → Parâmetros alterados (agora usa `hash` em vez de `email`)

### Fluxo Simplificado
- ❌ **Antes**: Email → Código → Validação → Nova Senha
- ✅ **Agora**: Email → Link → Nova Senha

### Segurança Melhorada
- Hash único por usuário
- Link com prazo de validade
- Sem necessidade de digitar código manualmente 