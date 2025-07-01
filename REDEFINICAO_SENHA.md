# Redefinição de Senha - Bem Especial

## Visão Geral

A funcionalidade de redefinição de senha foi implementada e está disponível através de uma URL dedicada. Esta funcionalidade permite que os usuários redefinam suas senhas de forma segura através de um código de verificação enviado por e-mail.

## URLs Disponíveis

### URL Principal
```
https://seu-dominio.com/2Bold/reset-password
```

### URLs com Parâmetros (Opcional)
```
https://seu-dominio.com/2Bold/reset-password?email=usuario@exemplo.com
https://seu-dominio.com/2Bold/reset-password?email=usuario@exemplo.com&token=abc123
```

## Fluxo de Redefinição

1. **Página Inicial**: Usuário acessa a URL de redefinição
2. **Inserção de E-mail**: Usuário digita seu e-mail cadastrado
3. **Envio de Código**: Sistema envia código de 6 dígitos para o e-mail
4. **Validação do Código**: Usuário digita o código recebido
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

1. **Enviar Código de Redefinição**
   - Action: `EnviarCodigoRedefinicao`
   - Parâmetros: `{ email }`

2. **Validar Código de Redefinição**
   - Action: `ValidarCodigoRedefinicao`
   - Parâmetros: `{ email, codigo }`

3. **Redefinir Senha**
   - Action: `RedefinirSenha`
   - Parâmetros: `{ email, novaSenha, confirmarSenha }`

### Exemplo de Uso para E-mail

Para incluir no e-mail "Esqueci minha senha", use:

```html
<p>Para redefinir sua senha, clique no link abaixo:</p>
<a href="https://seu-dominio.com/2Bold/reset-password?email={{email_do_usuario}}">
  Redefinir Senha
</a>
```

## Funcionalidades

- ✅ Interface responsiva
- ✅ Validação de e-mail
- ✅ Código de segurança de 6 dígitos
- ✅ Reenvio de código (após 5 minutos)
- ✅ Validação de requisitos da senha
- ✅ Confirmação de senha
- ✅ Tratamento de erros
- ✅ Redirecionamento automático após sucesso

## Segurança

- Código de verificação com tempo de expiração
- Validação de requisitos de senha forte
- Confirmação de senha obrigatória
- Tratamento seguro de erros (não expõe informações sensíveis)

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
- Suporte a parâmetros de URL para pré-preenchimento 