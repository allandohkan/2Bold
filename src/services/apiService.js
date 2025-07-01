// Configurações da API
const API_BASE_URL = 'http://k8s-dclube-producao-17f651f37d-680923557.sa-east-1.elb.amazonaws.com';
const AUTH_URL = `${API_BASE_URL}/geral/autenticacao`;
const ACTION_URL = `${API_BASE_URL}/geral/action`;

// Credenciais de autenticação
const API_CREDENTIALS = {
  email: 'epharma@zicard.com.br',
  senha: 'Zrd@9032!8*'
};

class ApiService {
  constructor() {
    this.token = null;
    this.tokenExpiry = null;
    this.useAuth = false; // Flag para controlar se usa autenticação
  }

  // Autenticação para obter token
  async authenticate(retryCount = 0) {
    const maxRetries = 2;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos de timeout
      
      const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(API_CREDENTIALS),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      // Se for Status 0 e ainda não tentou o máximo de vezes, tenta novamente
      if (response.status === 0 && retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.authenticate(retryCount + 1);
      }
      
      const responseText = await response.clone().text();

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro na autenticação: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      // Tentar diferentes campos possíveis para o token
      this.token = data.token || data.access_token || data.accessToken || data.Token || data.AccessToken;
      
      if (!this.token) {
        throw new Error('Token não encontrado na resposta da autenticação');
      }
      
      this.tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
      this.useAuth = true;
      
      return this.token;
    } catch (error) {
      // Se for erro de timeout ou Status 0 e ainda não tentou o máximo de vezes, tenta novamente
      if ((error.name === 'AbortError' || error.message.includes('Status 0')) && retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.authenticate(retryCount + 1);
      }
      
      this.useAuth = false;
      throw error;
    }
  }

  // Verificar se o token é válido
  async ensureValidToken() {
    if (!this.token || (this.tokenExpiry && new Date() > this.tokenExpiry)) {
      await this.authenticate();
    }
    return this.token;
  }

  // Obter token atual
  getToken() {
    return this.token;
  }

  // Método genérico para fazer requisições
  async makeRequest(action, body = {}) {
    try {
      // Garantir que temos um token válido se a autenticação estiver habilitada
      let token = null;
      if (this.useAuth) {
        token = await this.ensureValidToken();
      }
      
      const requestBody = {
        action,
        body
      };
      
      const response = await fetch(ACTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        // Tentar ler o corpo da resposta como texto primeiro
        const responseText = await response.text();
        
        // Se a resposta não estiver vazia, tentar fazer parse como JSON
        let errorData;
        try {
          errorData = responseText ? JSON.parse(responseText) : { error: 'Resposta vazia' };
        } catch (parseError) {
          errorData = { error: responseText || 'Erro desconhecido' };
        }
        
        throw new Error(`Erro na requisição ${action}: ${response.status} - ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Consultar CPF
  async consultarCPF(cpf) {
    try {
      // Sempre autenticar primeiro, já que a API exige token para todas as operações
      await this.authenticate();
      this.useAuth = true;
      
      const result = await this.makeRequest('ConsultarCPF', { cpf });
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Cadastrar senha
  async cadastrarSenha(idparticipante, senha, confirmasenha) {
    // Garantir que temos um token válido
    if (!this.token) {
      await this.authenticate();
    }
    
    // Usar autenticação da API
    const originalUseAuth = this.useAuth;
    this.useAuth = true;
    
    try {
      const result = await this.makeRequest('CadastrarSenha', {
        idparticipante,
        senha,
        confirmasenha
      });
      return result;
    } catch (error) {
      throw error;
    } finally {
      this.useAuth = originalUseAuth;
    }
  }

  // Validar código
  async validarCodigo(idparticipante, codigovalidacao) {
    // Garantir que temos um token válido
    if (!this.token) {
      await this.authenticate();
    }
    
    // Usar autenticação da API
    const originalUseAuth = this.useAuth;
    this.useAuth = true;
    
    try {
      const result = await this.makeRequest('ValidarCodigo', {
        idparticipante,
        codigovalidacao
      });
      return result;
    } catch (error) {
      throw error;
    } finally {
      this.useAuth = originalUseAuth;
    }
  }

  // Reenviar código
  async reenviarCodigo(idparticipante) {
    // Garantir que temos um token válido
    if (!this.token) {
      await this.authenticate();
    }
    
    // Usar autenticação da API
    const originalUseAuth = this.useAuth;
    this.useAuth = true;
    
    try {
      const result = await this.makeRequest('ReenviarCodigo', {
        idparticipante
      });
      return result;
    } catch (error) {
      throw error;
    } finally {
      this.useAuth = originalUseAuth;
    }
  }

  // Enviar email para redefinição de senha (novo fluxo)
  async resetSenha(email) {
    // Garantir que temos um token válido
    if (!this.token) {
      await this.authenticate();
    }
    
    // Usar autenticação da API
    const originalUseAuth = this.useAuth;
    this.useAuth = true;
    
    try {
      const result = await this.makeRequest('ResetSenha', {
        email,
        paginaRedefinirSenha: window.location.origin + '/reset-password'
      });
      return result;
    } catch (error) {
      throw error;
    } finally {
      this.useAuth = originalUseAuth;
    }
  }

  // Redefinir senha usando hash (novo fluxo)
  async redefinirSenha(codigoHash, senha, confirmasenha) {
    // Garantir que temos um token válido
    if (!this.token) {
      await this.authenticate();
    }
    
    // Usar autenticação da API
    const originalUseAuth = this.useAuth;
    this.useAuth = true;
    
    try {
      const result = await this.makeRequest('RedefinirSenha', {
        codigoHash,
        senha,
        confirmasenha
      });
      return result;
    } catch (error) {
      throw error;
    } finally {
      this.useAuth = originalUseAuth;
    }
  }

  // Autenticar usuário
  async autenticarUsuario(idparticipante, senha) {
    // Garantir que temos um token válido antes de autenticar o usuário
    if (!this.token) {
      await this.authenticate();
    }
    
    // Usar autenticação da API
    const originalUseAuth = this.useAuth;
    this.useAuth = true;
    
    try {
      const result = await this.makeRequest('AutenticarUsuario', {
        idparticipante,
        senha
      });
      return result;
    } catch (error) {
      throw error;
    } finally {
      this.useAuth = originalUseAuth;
    }
  }

  // Consultar saldo
  async consultarSaldo(idparticipante) {
    // Garantir que temos um token válido
    if (!this.token) {
      await this.authenticate();
    }
    
    // Usar autenticação da API
    const originalUseAuth = this.useAuth;
    this.useAuth = true;
    
    try {
      const result = await this.makeRequest('ConsultarSaldo', {
        idparticipante
      });
      return result;
    } catch (error) {
      throw error;
    } finally {
      this.useAuth = originalUseAuth;
    }
  }

  // Listar produtos
  async listarProdutos(idparticipante) {
    // Garantir que temos um token válido
    if (!this.token) {
      await this.authenticate();
    }
    
    // Usar autenticação da API
    const originalUseAuth = this.useAuth;
    this.useAuth = true;
    
    try {
      const result = await this.makeRequest('ListarProdutos', {
        idparticipante
      });
      return result;
    } catch (error) {
      throw error;
    } finally {
      this.useAuth = originalUseAuth;
    }
  }

  // Meus pontos
  async meusPontos(idparticipante, userName = null) {
    // Garantir que temos um token válido
    if (!this.token) {
      await this.authenticate();
    }
    
    // Usar autenticação da API
    const originalUseAuth = this.useAuth;
    this.useAuth = true;
    
    try {
      const body = {
        idparticipante
      };
      
      // Adicionar nome do usuário se fornecido
      if (userName) {
        body.nome = userName;
      }
      
      const result = await this.makeRequest('MeusPontos', body);
      
      // Verificar se é um usuário sem transações (success: 0 com mensagem específica)
      if (result.success === 0 && result.message && result.message.includes('Participante não tem transações')) {
        // Usuário sem transações - retornar dados estruturados como success: 1
        return {
          success: 1,
          data: {
            saldo: 0,
            transacoes: []
          },
          message: 'Você não tem pontuação nesse momento.'
        };
      }
      
      // Verificar se é um usuário sem transações (success: 1 com lista vazia)
      if (result.success === 1 && result.data && result.data.transacoes && result.data.transacoes.length === 0) {
        // Usuário sem transações - retornar dados estruturados
        return {
          success: 1,
          data: {
            saldo: result.data.saldo || 0,
            transacoes: []
          },
          message: result.message
        };
      }
      
      return result;
    } catch (error) {
      throw error;
    } finally {
      this.useAuth = originalUseAuth;
    }
  }

  // Meus vouchers
  async meusVouchers(idparticipante) {
    // Garantir que temos um token válido
    if (!this.token) {
      await this.authenticate();
    }
    
    // Usar autenticação da API
    const originalUseAuth = this.useAuth;
    this.useAuth = true;
    
    try {
      const result = await this.makeRequest('MeusVouchers', {
        idparticipante
      });
      return result;
    } catch (error) {
      throw error;
    } finally {
      this.useAuth = originalUseAuth;
    }
  }

  // Resgatar voucher
  async resgatarVoucher(idparticipante, idproduto, qtde) {
    // Garantir que temos um token válido
    if (!this.token) {
      await this.authenticate();
    }
    
    // Usar autenticação da API
    const originalUseAuth = this.useAuth;
    this.useAuth = true;
    
    try {
      const result = await this.makeRequest('ResgatarVoucher', {
        idparticipante,
        idproduto,
        qtde
      });
      return result;
    } catch (error) {
      throw error;
    } finally {
      this.useAuth = originalUseAuth;
    }
  }
}

// Instância singleton do serviço
const apiService = new ApiService();
export default apiService; 