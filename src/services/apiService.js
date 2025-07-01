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
      console.log(`Iniciando autenticação (tentativa ${retryCount + 1})...`);
      console.log('Payload de autenticação:', API_CREDENTIALS);
      
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
      console.log('Resposta da autenticação:', response.status, response.statusText);
      
      // Se for Status 0 e ainda não tentou o máximo de vezes, tenta novamente
      if (response.status === 0 && retryCount < maxRetries) {
        console.log(`Autenticação falhou com Status 0, tentando novamente em 1 segundo...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.authenticate(retryCount + 1);
      }
      
      const responseText = await response.clone().text();
      console.log('Corpo da resposta de autenticação:', responseText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta:', errorText);
        throw new Error(`Erro na autenticação: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Dados da autenticação:', data);
      
      // Tentar diferentes campos possíveis para o token
      this.token = data.token || data.access_token || data.accessToken || data.Token || data.AccessToken;
      
      if (!this.token) {
        console.error('Token não encontrado na resposta:', data);
        throw new Error('Token não encontrado na resposta da autenticação');
      }
      
      this.tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
      console.log('Token obtido com sucesso');
      this.useAuth = true;
      
      return this.token;
    } catch (error) {
      console.error(`Erro na autenticação (tentativa ${retryCount + 1}):`, error);
      
      // Se for erro de timeout ou Status 0 e ainda não tentou o máximo de vezes, tenta novamente
      if ((error.name === 'AbortError' || error.message.includes('Status 0')) && retryCount < maxRetries) {
        console.log(`Tentativa ${retryCount + 1} falhou, tentando novamente em 2 segundos...`);
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
      console.log('Token ausente ou expirado, autenticando novamente...');
      await this.authenticate();
    }
    return this.token;
  }

  // Método genérico para fazer requisições
  async makeRequest(action, body, retryCount = 0) {
    const maxRetries = 2;
    
    try {
      // Sempre autentica antes de qualquer requisição
      const token = await this.ensureValidToken();
      console.log(`Fazendo requisição: ${action} (tentativa ${retryCount + 1})`, body);
      const requestBody = {
        action: action,
        body: body
      };
      console.log('Corpo da requisição:', requestBody);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos de timeout

      const response = await fetch(ACTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log(`Resposta da requisição com auth ${action}:`, response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro na requisição com auth ${action}:`, errorText);
        
        // Se for erro 0 (Status 0) e ainda não tentou o máximo de vezes, tenta novamente
        if (response.status === 0 && retryCount < maxRetries) {
          console.log(`Tentativa ${retryCount + 1} falhou com Status 0, tentando novamente...`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1 segundo
          return this.makeRequest(action, body, retryCount + 1);
        }
        
        throw new Error(`Erro na requisição ${action}: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`Dados da resposta com auth ${action}:`, data);
      return data;
    } catch (error) {
      console.error(`Erro na requisição ${action} (tentativa ${retryCount + 1}):`, error);
      
      // Se for erro de timeout ou rede e ainda não tentou o máximo de vezes, tenta novamente
      if ((error.name === 'AbortError' || error.message.includes('Status 0')) && retryCount < maxRetries) {
        console.log(`Tentativa ${retryCount + 1} falhou, tentando novamente em 2 segundos...`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos
        return this.makeRequest(action, body, retryCount + 1);
      }
      
      throw error;
    }
  }

  // Consultar CPF
  async consultarCPF(cpf) {
    console.log('Consultando CPF:', cpf);
    return this.makeRequest('ConsultarCPF', { cpf });
  }

  // Cadastrar senha
  async cadastrarSenha(idparticipante, senha, confirmasenha) {
    return this.makeRequest('CadastrarSenha', {
      idparticipante,
      senha,
      confirmasenha
    });
  }

  // Validar código
  async validarCodigo(idparticipante, codigovalidacao) {
    return this.makeRequest('ValidarCodigo', {
      idparticipante,
      codigovalidacao
    });
  }

  // Reenviar código
  async reenviarCodigo(idparticipante) {
    return this.makeRequest('ReenviarCodigo', {
      idparticipante
    });
  }

  // Enviar email para redefinição de senha (novo fluxo)
  async resetSenha(email) {
    return this.makeRequest('ResetSenha', {
      email
    });
  }

  // Redefinir senha usando hash (novo fluxo)
  async redefinirSenha(hash, novaSenha, confirmarSenha) {
    return this.makeRequest('RedefinirSenha', {
      hash,
      novaSenha,
      confirmarSenha
    });
  }

  // Autenticar usuário
  async autenticarUsuario(idparticipante, senha) {
    return this.makeRequest('AutenticarUsuario', {
      idparticipante,
      senha
    });
  }

  // Consultar saldo
  async consultarSaldo(idparticipante) {
    return this.makeRequest('ConsultarSaldo', {
      idparticipante
    });
  }

  // Listar produtos
  async listarProdutos(idparticipante) {
    return this.makeRequest('ListarProdutos', {
      idparticipante
    });
  }

  // Meus pontos
  async meusPontos(idparticipante) {
    return this.makeRequest('MeusPontos', {
      idparticipante
    });
  }

  // Meus vouchers
  async meusVouchers(idparticipante) {
    return this.makeRequest('MeusVouchers', {
      idparticipante
    });
  }

  // Resgatar voucher
  async resgatarVoucher(idparticipante, idproduto, qtde) {
    return this.makeRequest('ResgatarVoucher', {
      idparticipante,
      idproduto,
      qtde
    });
  }
}

// Instância singleton do serviço
const apiService = new ApiService();
export default apiService; 