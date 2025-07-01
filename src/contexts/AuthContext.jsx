import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  const [isFullyAuthenticated, setIsFullyAuthenticated] = useState(false); // Flag para login completo
  const initialized = useRef(false);
  
  // Cache para pontos do usuário
  const [pointsCache, setPointsCache] = useState({
    data: null,
    timestamp: null,
    userId: null
  });
  
  // Tempo de expiração do cache (5 minutos)
  const CACHE_EXPIRATION = 5 * 60 * 1000;

  // Funções para gerenciar cache
  const isCacheValid = (userId) => {
    if (!pointsCache.data || pointsCache.userId !== userId) {
      return false;
    }
    
    const now = Date.now();
    const cacheAge = now - pointsCache.timestamp;
    
    return cacheAge < CACHE_EXPIRATION;
  };

  const updatePointsCache = (userId, data) => {
    setPointsCache({
      data,
      timestamp: Date.now(),
      userId
    });
  };

  const clearPointsCache = () => {
    setPointsCache({
      data: null,
      timestamp: null,
      userId: null
    });
  };

  const forceRefreshPoints = () => {
    clearPointsCache();
  };

  // Carregar dados do usuário do localStorage na inicialização
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    // Evitar carregamento duplicado
    if (!loading) return;
    
    console.log('🔄 AuthContext - Carregando localStorage');
    const savedUser = localStorage.getItem('user');
    const savedAuthStatus = localStorage.getItem('isFullyAuthenticated');
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        const authStatus = savedAuthStatus === 'true';
        console.log('AuthContext - User carregado:', userData?.idparticipante, 'Auth:', authStatus);
        
        // Definir estados de forma síncrona
        setUser(userData);
        setIsFullyAuthenticated(authStatus);
        
        // Verificar se o usuário está realmente autenticado
        if (authStatus) {
          setCurrentStep('authenticated');
          console.log('AuthContext - Usuário autenticado ✓');
        } else {
          // Se há usuário mas não está totalmente autenticado, vai para CPF primeiro
          setCurrentStep('cpf');
          console.log('AuthContext - Usuário não autenticado, vai para CPF');
        }
      } catch (error) {
        console.error('AuthContext - Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('isFullyAuthenticated');
        setCurrentStep('cpf');
        setIsFullyAuthenticated(false);
      }
    } else {
      console.log('AuthContext - Nenhum usuário no localStorage, vai para CPF');
      setCurrentStep('cpf');
      setIsFullyAuthenticated(false);
    }
    setLoading(false);
  }, [loading]);

  // Salvar dados do usuário no localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Salvar status de autenticação no localStorage
  useEffect(() => {
    localStorage.setItem('isFullyAuthenticated', isFullyAuthenticated.toString());
  }, [isFullyAuthenticated]);

  // Monitorar mudanças no localStorage e sincronizar estado
  useEffect(() => {
    // Só monitorar se não estiver carregando
    if (loading) return;
    
    const checkAuthState = () => {
      const savedUser = localStorage.getItem('user');
      const savedAuthStatus = localStorage.getItem('isFullyAuthenticated');
      
      if (savedUser && savedAuthStatus === 'true' && !isFullyAuthenticated) {
        console.log('AuthContext - Inconsistência detectada, sincronizando...');
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsFullyAuthenticated(true);
          setCurrentStep('authenticated');
        } catch (error) {
          console.error('AuthContext - Erro ao sincronizar estado:', error);
        }
      }
    };

    // Verificar a cada 2 segundos se há inconsistência (menos agressivo)
    const interval = setInterval(checkAuthState, 2000);
    return () => clearInterval(interval);
  }, [isFullyAuthenticated, loading]);



  const login = (userData) => {
    setUser(userData);
    setError(null);
    setCurrentStep('authenticated');
  };

  const logout = () => {
    // Limpar localStorage primeiro
    localStorage.removeItem('user');
    localStorage.removeItem('isFullyAuthenticated');
    // Limpar cache
    clearPointsCache();
    // Limpar estados
    setError(null);
    setCurrentStep('cpf');
    setUser(null);
    setIsFullyAuthenticated(false);

  };

  const clearError = () => {
    setError(null);
  };

  // Função de debug para verificar o estado atual
  const debugAuthState = () => {
    console.log('=== DEBUG AUTH STATE ===');
    console.log('user:', user?.idparticipante);
    console.log('isFullyAuthenticated:', isFullyAuthenticated);
    console.log('currentStep:', currentStep);
    console.log('loading:', loading);
    console.log('localStorage user:', localStorage.getItem('user') ? 'presente' : 'ausente');
    console.log('localStorage isFullyAuthenticated:', localStorage.getItem('isFullyAuthenticated'));
    console.log('========================');
  };

  // Função para forçar sincronização do estado
  const syncAuthState = () => {
    const savedUser = localStorage.getItem('user');
    const savedAuthStatus = localStorage.getItem('isFullyAuthenticated');
    
    if (savedUser && savedAuthStatus === 'true') {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsFullyAuthenticated(true);
        setCurrentStep('authenticated');

      } catch (error) {
        console.error('AuthContext - Erro ao sincronizar estado:', error);
      }
    }
  };

  // Métodos da API
  const consultarCPF = async (cpf) => {
    try {
      setError(null);
      const response = await apiService.consultarCPF(cpf);
      
      // Verificar se é um caso de cadastro de senha necessário
      if (response.success === 0 && 
          (response.data?.proximoPasso === 'Solicitar cadastro de senha' || 
           response.message?.includes('CPF encontrado na base mas ainda não cadastro a senha'))) {
        
        // CPF encontrado mas precisa cadastrar senha
        const userData = {
          idparticipante: response.data.idparticipante,
          nome: response.data.nome,
          cpf: cpf
        };
        
        setUser(userData);
        setIsFullyAuthenticated(false);
        setCurrentStep('createPassword');
        
        return {
          success: true,
          data: response.data,
          message: response.message
        };
      }
      
      if (response.success === 1) {
        // CPF encontrado na base de dados
        const userData = {
          idparticipante: response.data.idparticipante,
          nome: response.data.nome,
          cpf: cpf
        };
        
        setUser(userData);
        // Garantir que o usuário não seja considerado autenticado automaticamente
        setIsFullyAuthenticated(false);
        
        // Determinar próximo passo baseado na resposta da API
        if (response.data.proximoPasso === 'Solicitar Senha') {
          setCurrentStep('password');
        } else if (response.data.proximoPasso === 'Cadastrar Senha' || 
                   response.message?.includes('CPF encontrado na base mas ainda não cadastro a senha')) {
          setCurrentStep('createPassword');
        } else {
          setCurrentStep('login');
        }
        
        return {
          success: true,
          data: response.data,
          message: response.message
        };
      } else {
        return {
          success: false,
          message: response.message,
          data: response.data
        };
      }
    } catch (error) {
      
      // Tratar diferentes tipos de erro
      let errorMessage = 'Erro ao consultar CPF';
      
      if (error.message.includes('401')) {
        errorMessage = 'Erro de autenticação. Tente novamente.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (error.message.includes('Unexpected end of JSON input')) {
        errorMessage = 'Erro na resposta do servidor. Tente novamente.';
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
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
        setIsFullyAuthenticated(true);
        
        // Atualizar dados do usuário se a API retornar informações adicionais
        if (response.data) {
          const updatedUser = {
            ...user,
            ...response.data
          };
          setUser(updatedUser);
        }
        
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
    if (!user?.idparticipante) {
      setError('Usuário não identificado');
      return {
        success: false,
        message: 'Usuário não identificado'
      };
    }

    try {
      setError(null);
      const response = await apiService.autenticarUsuario(user.idparticipante, senha);
      
      if (response.success === 1) {
        setCurrentStep('authenticated');
        setIsFullyAuthenticated(true);
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
      const response = await apiService.listarProdutos(idparticipante);
      
      if (response.success === 1) {
        // A API retorna os produtos em response.data.produtos conforme a documentação
        const produtos = response.data?.produtos || [];
        
        return {
          success: true,
          data: produtos,
          message: response.message
        };
      } else {
        return {
          success: false,
          message: response.message
        };
      }
    } catch (error) {
      setError(error.message);
      return {
        success: false,
        message: error.message
      };
    }
  };

  const meusPontos = async (idparticipante, forceRefresh = false) => {
    // Verificar se temos cache válido e não foi solicitado refresh forçado
    if (!forceRefresh && isCacheValid(idparticipante)) {
      return {
        success: true,
        data: pointsCache.data,
        fromCache: true
      };
    }
    
    try {
      // Passar o nome do usuário autenticado para o apiService
      const userName = user?.nome || null;
      const response = await apiService.meusPontos(idparticipante, userName);
      
      if (response && response.success === 1 && response.data) {
        // Atualizar cache com os novos dados
        updatePointsCache(idparticipante, response.data);
        
        return {
          success: true,
          data: response.data,
          fromCache: false
        };
      } else {
        return {
          success: false,
          message: response?.message || 'Erro desconhecido na consulta de pontos'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Erro na requisição MeusPontos: ${error.message}`
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
        // Limpar cache dos pontos, pois o resgate altera o saldo
        clearPointsCache();
        
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

  const value = useMemo(() => ({
    user,
    loading,
    error,
    currentStep,
    setCurrentStep,
    isFullyAuthenticated,
    login,
    logout,
    clearError,
    debugAuthState,
    syncAuthState,
    consultarCPF,
    cadastrarSenha,
    validarCodigo,
    reenviarCodigo,
    autenticarUsuario,
    consultarSaldo,
    listarProdutos,
    meusPontos,
    meusVouchers,
    resgatarVoucher,
    // Funções de cache
    forceRefreshPoints,
    clearPointsCache,
    pointsCache
  }), [
    user,
    loading,
    error,
    currentStep,
    isFullyAuthenticated,
    pointsCache
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Wrapper para prevenir re-renderizações desnecessárias
const AuthProviderWrapper = React.memo(({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
});

export { AuthContext, AuthProviderWrapper }; 