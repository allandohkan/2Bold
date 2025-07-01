import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PasswordValidation from '../components/Login/PasswordValidation.jsx';
import SecurityCodeForm from '../components/Login/SecutiryCodeForm.jsx';
import '../styles/pages/_login.scss';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

import BemEspecialLoginDesktopLogo from '../assets/images/Login_Desktop_Logo.png';
import BemEspecialLoginSenha from '../assets/images/Login_Desktop_Senha.png';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setCurrentStep } = useAuth();
  
  const [currentStep, setLocalCurrentStep] = useState('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Verificar se há token na URL (opcional, para validação adicional)
  const token = searchParams.get('token');
  const emailFromUrl = searchParams.get('email');

  useEffect(() => {
    // Se há email na URL, usar ele
    if (emailFromUrl) {
      setEmail(emailFromUrl);
      setLocalCurrentStep('securityCode');
    }
  }, [emailFromUrl]);

  const handleEmailSubmit = async () => {
    if (!email) {
      setError('Por favor, insira seu e-mail');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await apiService.enviarCodigoRedefinicao(email);
      
      if (response.success === 1) {
        setLocalCurrentStep('securityCode');
      } else {
        setError(response.message || 'Erro ao enviar código. Tente novamente.');
      }
    } catch (error) {
      setError('Erro ao enviar código. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecurityCodeValidation = async (code) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await apiService.validarCodigoRedefinicao(email, code);
      
      if (response.success === 1) {
        setLocalCurrentStep('resetPassword');
      } else {
        setError(response.message || 'Código inválido. Tente novamente.');
        throw new Error(response.message);
      }
    } catch (error) {
      setError('Código inválido. Tente novamente.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendSecurityCode = async () => {
    try {
      const response = await apiService.enviarCodigoRedefinicao(email);
      
      if (response.success === 1) {
        alert('Novo código enviado para seu e-mail!');
      } else {
        setError(response.message || 'Erro ao reenviar código');
      }
    } catch (error) {
      setError('Erro ao reenviar código');
    }
  };

  const handlePasswordReset = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await apiService.redefinirSenha(email, newPassword, confirmPassword);
      
      if (response.success === 1) {
        alert('Senha alterada com sucesso!');
        navigate('/login');
      } else {
        setError(response.message || 'Erro ao alterar senha. Tente novamente.');
      }
    } catch (error) {
      setError('Erro ao alterar senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div 
      className="login-container" 
      style={{ backgroundImage: `url(${BemEspecialLoginSenha})` }}
    >
      <div className="login-overlay">
        <div className="login-card">
          <div className="logo-login-section">
            <img 
              src={BemEspecialLoginDesktopLogo} 
              alt="Bem Especial Logo" 
              className="logo-image" 
            />
          </div>

          {currentStep === 'email' && (
            <div className="form-section">
              <div className="form-description">
                <p>
                  Para redefinir sua senha, enviaremos um código<br />
                  de segurança para seu e-mail cadastrado.
                </p>
              </div>

              <div className="input-group">
                <input
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
              </div>

              {error && (
                <div className="error-message">
                  <p>{error}</p>
                </div>
              )}

              <button
                onClick={handleEmailSubmit}
                disabled={!email || isLoading}
                className="btn-primary"
              >
                {isLoading ? 'ENVIANDO...' : 'ENVIAR CÓDIGO'}
              </button>

              <div className="form-footer">
                <button 
                  onClick={handleBackToLogin}
                  className="link-button"
                >
                  Voltar ao login
                </button>
              </div>
            </div>
          )}

          {currentStep === 'securityCode' && (
            <SecurityCodeForm
              onAdvance={handleSecurityCodeValidation}
              onResendCode={handleResendSecurityCode}
              onBack={() => setLocalCurrentStep('email')}
              email={email}
              isLoading={isLoading}
              title="Digite o código de 6 dígitos enviado para seu e-mail."
            />
          )}

          {currentStep === 'resetPassword' && (
            <PasswordValidation
              password={newPassword}
              setPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              onAdvance={handlePasswordReset}
              title="Crie uma nova senha para sua conta."
              showConfirmation={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage; 