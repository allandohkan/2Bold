import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState('cpf'); // login, cpf, password, code, authenticated

  // Carregar dados do usuário do localStorage na inicialização
  useEffect(() => {
    console.log('AuthContext - Iniciando carregamento do localStorage');
    const savedUser = localStorage.getItem('user');
    console.log('AuthContext - Dados salvos no localStorage:', savedUser);
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('AuthContext - Dados do usuário carregados do localStorage:', userData);
        setUser(userData);
        // Se há dados do usuário salvos, significa que está autenticado
        setCurrentStep('authenticated');
        console.log('AuthContext - Usuário autenticado, currentStep definido como "authenticated"');
      } catch (error) {
        console.error('AuthContext - Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('user');
        setCurrentStep('cpf');
        console.log('AuthContext - Erro no parse, currentStep definido como "cpf"');
      }
    } else {
      console.log('AuthContext - Nenhum usuário encontrado no localStorage');
      setCurrentStep('cpf');
      console.log('AuthContext - currentStep definido como "cpf"');
    }
    setLoading(false);
    console.log('AuthContext - Loading finalizado');
  }, []);

  // Salvar dados do usuário no localStorage quando mudar
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    setError(null);
    setCurrentStep('authenticated');
  };

  const logout = () => {
    setUser(null);
    setError(null);
    setCurrentStep('cpf');
    localStorage.removeItem('user');
  };

  const clearError = () => {
    setError(null);
  };

  // Métodos da API
  const consultarCPF = async (cpf) => {
    console.log('AuthContext - consultarCPF chamado com CPF:', cpf);
    try {
      setError(null);
      const response = await apiService.consultarCPF(cpf);
      console.log('AuthContext - Resposta da API consultarCPF:', response);
      
      if (response.success === 1) {
        // CPF encontrado na base de dados
        const userData = {
          idparticipante: response.data.idparticipante,
          nome: response.data.nome,
          cpf: cpf
        };
        
        console.log('AuthContext - Dados do usuário a serem salvos:', userData);
        setUser(userData);
        
        // Determinar próximo passo baseado na resposta da API
        if (response.data.proximoPasso === 'Solicitar Senha') {
          setCurrentStep('password');
          console.log('AuthContext - Próximo passo: password');
        } else {
          setCurrentStep('login');
          console.log('AuthContext - Próximo passo: login');
        }
        
        return {
          success: true,
          data: response.data,
          message: response.message
        };
      } else {
        console.log('AuthContext - CPF não encontrado ou erro na API');
        return {
          success: false,
          message: response.message,
          data: response.data
        };
      }
    } catch (error) {
      console.error('AuthContext - Erro ao consultar CPF:', error);
      setError(error.message);
      return {
        success: false,
        message: error.message
      };
    }
  };

  const cadastrarSenha = async (senha, confirmasenha) => {
    if (!user?.idparticipante) {
      setError('Usuário não identificado');
      return {
        success: false,
        message: 'Usuário não identificado'
      };
    }

    try {
      setError(null);
      const response = await apiService.cadastrarSenha(user.idparticipante, senha, confirmasenha);
      
      if (response.success === 1) {
        setCurrentStep('code');
        return {
          success: true,
          message: response.message
        };
      } else {
        return {
          success: false,
          message: response.message
        };
      }
    } catch (error) {
      console.error('Erro ao cadastrar senha:', error);
      setError(error.message);
      return {
        success: false,
        message: error.message
      };
    }
  };

  const validarCodigo = async (codigo) => {
    if (!user?.idparticipante) {
      setError('Usuário não identificado');
      return {
        success: false,
        message: 'Usuário não identificado'
      };
    }

    try {
      setError(null);
      const response = await apiService.validarCodigo(user.idparticipante, codigo);
      
      if (response.success === 1) {
        setCurrentStep('authenticated');
        return {
          success: true,
          message: response.message
        };
      } else {
        return {
          success: false,
          message: response.message
        };
      }
    } catch (error) {
      console.error('Erro ao validar código:', error);
      setError(error.message);
      return {
        success: false,
        message: error.message
      };
    }
  };

  const reenviarCodigo = async () => {
    if (!user?.idparticipante) {
      setError('Usuário não identificado');
      return {
        success: false,
        message: 'Usuário não identificado'
      };
    }

    try {
      setError(null);
      const response = await apiService.reenviarCodigo(user.idparticipante);
      
      if (response.success === 1) {
        return {
          success: true,
          message: response.message
        };
      } else {
        return {
          success: false,
          message: response.message
        };
      }
    } catch (error) {
      console.error('Erro ao reenviar código:', error);
      setError(error.message);
      return {
        success: false,
        message: error.message
      };
    }
  };

  const autenticarUsuario = async (senha) => {
    console.log('AuthContext - autenticarUsuario chamado');
    console.log('AuthContext - user atual:', user);
    
    if (!user?.idparticipante) {
      console.log('AuthContext - Usuário não identificado');
      setError('Usuário não identificado');
      return {
        success: false,
        message: 'Usuário não identificado'
      };
    }

    try {
      setError(null);
      console.log('AuthContext - Chamando API autenticarUsuario');
      const response = await apiService.autenticarUsuario(user.idparticipante, senha);
      console.log('AuthContext - Resposta da API autenticarUsuario:', response);
      
      if (response.success === 1) {
        console.log('AuthContext - Autenticação bem-sucedida, definindo currentStep como "authenticated"');
        setCurrentStep('authenticated');
        return {
          success: true,
          data: response.data,
          message: response.message
        };
      } else {
        console.log('AuthContext - Falha na autenticação:', response.message);
        return {
          success: false,
          message: response.message
        };
      }
    } catch (error) {
      console.error('AuthContext - Erro ao autenticar usuário:', error);
      setError(error.message);
      return {
        success: false,
        message: error.message
      };
    }
  };

  const consultarSaldo = async (idparticipante) => {
    try {
      setError(null);
      const response = await apiService.consultarSaldo(idparticipante);
      
      if (response.success === 1) {
        return {
          success: true,
          data: response.data,
          message: response.message
        };
      } else {
        return {
          success: false,
          message: response.message
        };
      }
    } catch (error) {
      console.error('Erro ao consultar saldo:', error);
      setError(error.message);
      return {
        success: false,
        message: error.message
      };
    }
  };

  const listarProdutos = async (idparticipante) => {
    try {
      setError(null);
      console.log('Chamando API listarProdutos para:', idparticipante);
      const response = await apiService.listarProdutos(idparticipante);
      console.log('Resposta bruta da API listarProdutos:', response);
      
      if (response.success === 1) {
        console.log('Produtos retornados:', response.data);
        console.log('Tipo dos dados:', typeof response.data);
        console.log('É array?', Array.isArray(response.data));
        
        // A API retorna os produtos em response.data.produtos conforme a documentação
        const produtos = response.data?.produtos || [];
        console.log('Array de produtos extraído:', produtos);
        
        return {
          success: true,
          data: produtos,
          message: response.message
        };
      } else {
        console.log('Erro na API listarProdutos:', response.message);
        return {
          success: false,
          message: response.message
        };
      }
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      setError(error.message);
      return {
        success: false,
        message: error.message
      };
    }
  };

  const meusPontos = async (idparticipante) => {
    try {
      setError(null);
      const response = await apiService.meusPontos(idparticipante);
      
      if (response.success === 1) {
        return {
          success: true,
          data: response.data,
          message: response.message
        };
      } else {
        return {
          success: false,
          message: response.message
        };
      }
    } catch (error) {
      console.error('Erro ao consultar pontos:', error);
      setError(error.message);
      return {
        success: false,
        message: error.message
      };
    }
  };

  const meusVouchers = async (idparticipante) => {
    try {
      setError(null);
      const response = await apiService.meusVouchers(idparticipante);
      
      if (response.success === 1) {
        return {
          success: true,
          data: response.data,
          message: response.message
        };
      } else {
        return {
          success: false,
          message: response.message
        };
      }
    } catch (error) {
      console.error('Erro ao consultar vouchers:', error);
      setError(error.message);
      return {
        success: false,
        message: error.message
      };
    }
  };

  const resgatarVoucher = async (idparticipante, idproduto, qtde) => {
    try {
      setError(null);
      const response = await apiService.resgatarVoucher(idparticipante, idproduto, qtde);
      
      if (response.success === 1) {
        return {
          success: true,
          data: response.data,
          message: response.message
        };
      } else {
        return {
          success: false,
          message: response.message
        };
      }
    } catch (error) {
      console.error('Erro ao resgatar voucher:', error);
      setError(error.message);
      return {
        success: false,
        message: error.message
      };
    }
  };

  const value = {
    user,
    loading,
    error,
    currentStep,
    setCurrentStep,
    login,
    logout,
    clearError,
    consultarCPF,
    cadastrarSenha,
    validarCodigo,
    reenviarCodigo,
    autenticarUsuario,
    consultarSaldo,
    listarProdutos,
    meusPontos,
    meusVouchers,
    resgatarVoucher
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext }; 