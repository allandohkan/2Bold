import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const isValidCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(cpf.charAt(10));
};

const formatCPF = (value) => {
  const numbers = value.replace(/\D/g, '');
  return numbers
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
};

const CPFValidation = ({ cpf, setCpf, onAdvance, onGoToPassword, onGoToRegisterPassword }) => {
  const { consultarCPF } = useAuth();
  const [apiMessage, setApiMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    const formatted = formatCPF(e.target.value);
    if (formatted.length <= 14) {
      setCpf(formatted);
      setApiMessage('');
      setIsError(false);
    }
  };

  const handleSubmit = async () => {
    if (!isValidCPF(cpf)) {
      setApiMessage('CPF inválido. Verifique os números digitados.');
      setIsError(true);
      return;
    }
    setIsLoading(true);
    try {
      const response = await consultarCPF(cpf.replace(/\D/g, ''));
      const proximoPasso = response?.data?.proximoPasso;
      console.log('proximoPasso retornado pela API:', proximoPasso);
      if (response.success === 1) {
        if (proximoPasso === 'Solicitar Senha') {
          if (onGoToPassword) onGoToPassword();
        } else if (proximoPasso === 'Cadastrar Senha') {
          if (onGoToRegisterPassword) onGoToRegisterPassword();
        } else {
          setApiMessage(response.message || 'Ação desconhecida.');
          setIsError(true);
        }
      } else if (response.success === 0 && proximoPasso === 'Solicitar novo CPF') {
        setApiMessage(response.message || 'CPF não encontrado.');
        setIsError(true);
      } else {
        setApiMessage(response.message || 'Erro desconhecido.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Erro na consulta de CPF:', error);
      
      // Verificar se é erro específico de Status 0
      if (error.message && error.message.includes('Status 0')) {
        setApiMessage('Erro de conexão. Verifique sua internet e tente novamente.');
      } else if (error.message && error.message.includes('timeout')) {
        setApiMessage('Tempo limite excedido. Tente novamente.');
      } else {
        setApiMessage('Erro de comunicação. Tente novamente.');
      }
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-section">
      <div className="form-description">
        <p>
          Insira o CPF cadastrado<br />
          para resgatar seus benefícios.
        </p>
      </div>

      <div className="input-group">
        <input
          type="text"
          placeholder="Insira CPF aqui"
          value={cpf}
          onChange={handleChange}
          className="input-field"
          disabled={isLoading}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={cpf.length !== 14 || isLoading}
        className="btn-primary"
      >
        {isLoading ? 'VERIFICANDO...' : 'AVANÇAR'}
      </button>
      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
          <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #ea4ea1',
            borderRadius: '50%',
            width: 32,
            height: 32,
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {apiMessage && (
        <div className={isError ? 'error-message' : ''}>
          {apiMessage}
        </div>
      )}

      
    </div>
  );
};

export default CPFValidation;