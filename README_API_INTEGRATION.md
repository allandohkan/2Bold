# Integração com API da Zicard - Projeto Roche/ePharma

## Visão Geral

Este projeto foi completamente integrado com a API da Zicard conforme a documentação fornecida. Todas as funcionalidades de autenticação, produtos, pontos e vouchers agora utilizam dados reais da API.

## Funcionalidades Implementadas

### 🔐 Autenticação Completa
- **Consultar CPF**: Validação de CPF na base de dados
- **Cadastrar Senha**: Criação de senha com validação de regras
- **Validar Código**: Verificação de código de segurança
- **Reenviar Código**: Reenvio de código de validação
- **Autenticar Usuário**: Login com CPF e senha

### 📦 Gestão de Produtos
- **Listar Produtos**: Exibição de produtos disponíveis
- **Seleção de Quantidade**: 1, 2 ou 3 caixas com pontos diferentes
- **Verificação de Saldo**: Validação de pontos suficientes
- **Resgate de Voucher**: Processo completo de resgate

### 💰 Sistema de Pontos
- **Consultar Saldo**: Exibição do saldo atual
- **Histórico de Transações**: Lista de compras e pontos ganhos
- **Meus Vouchers**: Histórico de resgates realizados

## Estrutura de Arquivos

### Serviços de API
- `src/services/apiService.js` - Cliente principal da API
- `src/services/productService.js` - Serviços específicos de produtos

### Contexto de Autenticação
- `src/contexts/AuthContext.jsx` - Gerenciamento de estado global

### Componentes Atualizados
- `src/components/Login/CPFValidation.jsx` - Integração com API
- `src/components/Login/PasswordValidation.jsx` - Validação de senha
- `src/components/Login/SecutiryCodeForm.jsx` - Código de segurança

### Páginas Integradas
- `src/pages/LoginPage.jsx` - Fluxo completo de login
- `src/pages/ProductListPage.jsx` - Lista de produtos
- `src/pages/SingleProduct.jsx` - Detalhes e resgate
- `src/pages/MyPointsPage.jsx` - Histórico de pontos
- `src/pages/VouchersPage.jsx` - Histórico de vouchers

## Configuração da API

### Endpoints Utilizados
- **Base URL**: `http://k8s-dclube-producao-17f651f37d-680923557.sa-east-1.elb.amazonaws.com`
- **Autenticação**: `/geral/autenticacao`
- **Ações**: `/geral/action`

### Credenciais
- **Login**: `epharma@zicard.com.br`
- **Senha**: `Zrd@9032!8*`

## Fluxo de Autenticação

1. **Consulta CPF**: Usuário informa CPF
2. **Validação**: Sistema verifica se CPF existe na base
3. **Cadastro de Senha**: Se necessário, usuário cria senha
4. **Código de Validação**: Sistema envia código por e-mail
5. **Validação de Código**: Usuário confirma código
6. **Login**: Usuário faz login com CPF e senha

## Funcionalidades de Produtos

### Seleção de Quantidade
- **1 caixa**: X pontos
- **2 caixas**: Y pontos  
- **3 caixas**: Z pontos

### Processo de Resgate
1. Usuário seleciona produto e quantidade
2. Sistema verifica saldo disponível
3. Usuário confirma resgate
4. Sistema gera voucher
5. Código é exibido e enviado por e-mail

## Estados de Voucher

- **Emitido**: Voucher criado, aguardando utilização
- **Utilizado**: Voucher já foi usado na farmácia
- **Expirado**: Voucher venceu

## Tratamento de Erros

### Tipos de Erro
- **Erro de Comunicação**: Problemas de rede
- **CPF não encontrado**: Usuário não cadastrado
- **Senha inválida**: Credenciais incorretas
- **Código expirado**: Código de validação venceu
- **Saldo insuficiente**: Pontos insuficientes para resgate

### Feedback ao Usuário
- Mensagens de erro claras e específicas
- Botões de "Tentar Novamente"
- Estados de loading durante operações
- Validação em tempo real

## Armazenamento Local

### Dados Persistidos
- Informações do usuário logado
- Token de autenticação
- Estado da sessão

### Segurança
- Dados sensíveis não são armazenados
- Token com expiração automática
- Logout limpa todos os dados

## Responsividade

### Mobile First
- Componentes adaptados para mobile
- Acordeões para tabelas em telas pequenas
- Navegação otimizada para touch

### Desktop
- Tabelas completas em telas grandes
- Layout otimizado para mouse
- Informações detalhadas

## Próximos Passos

### Melhorias Sugeridas
1. **Cache de Produtos**: Armazenar produtos localmente
2. **Offline Mode**: Funcionalidade básica sem internet
3. **Push Notifications**: Alertas de novos produtos
4. **Analytics**: Rastreamento de uso
5. **Testes Automatizados**: Cobertura de testes

### Funcionalidades Adicionais
1. **Recuperação de Senha**: Fluxo completo
2. **Perfil do Usuário**: Edição de dados pessoais
3. **Favoritos**: Produtos favoritados
4. **Histórico Detalhado**: Mais informações sobre transações

## Como Testar

1. **Acesse a aplicação**: `npm start`
2. **Teste o login**: Use um CPF válido da base
3. **Verifique produtos**: Navegue pela lista de produtos
4. **Teste resgate**: Simule um resgate de voucher
5. **Verifique histórico**: Acesse "Meus Pontos" e "Vouchers"

## Suporte

Para dúvidas sobre a implementação ou problemas com a API, consulte:
- Documentação da API da Zicard
- Logs do console do navegador
- Network tab para verificar requisições

---

**Desenvolvido com React + Vite + SCSS**
**Integração completa com API da Zicard** 