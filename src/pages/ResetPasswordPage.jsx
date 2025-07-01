import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PasswordValidation from '../components/Login/PasswordValidation.jsx';
import Modal from '../components/Modal.jsx';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

import BemEspecialLoginDesktopLogo from '../assets/images/Login_Desktop_Logo.png';
import BemEspecialLoginSenha from '../assets/images/Login_Desktop_Senha.png';
import SuccessImage from '../assets/images/image 418.png';
import FailedIcon from '../assets/images/failed-icon.png';

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
  const [modalConfig, setModalConfig] = useState({ isOpen: false, message: '', isSuccess: false });

  // Verificar se há hash na URL (novo fluxo)
  const codigoHash = searchParams.get('codigoHash') || searchParams.get('hashcode') || searchParams.get('hash');

  useEffect(() => {
    // Se há hash na URL, ir direto para redefinição de senha
    if (codigoHash) {
      setLocalCurrentStep('resetPassword');
    }
  }, [codigoHash, searchParams]);

  const handleEmailSubmit = async () => {
    if (!email) {
      setError('Por favor, insira seu e-mail');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await apiService.resetSenha(email);
      
      if (response.success === 1) {
        // Mostrar mensagem de sucesso e instruções
        setError('Email enviado com sucesso! Verifique sua caixa de entrada e clique no link recebido.');
        setLocalCurrentStep('emailSent');
      } else {
        setError(response.message || 'Erro ao enviar email. Tente novamente.');
      }
    } catch (error) {
      setError('Erro ao enviar email. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!codigoHash) {
      setError('Link inválido para redefinição de senha.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await apiService.redefinirSenha(codigoHash, newPassword, confirmPassword);
      
      if (response.success === 1) {
        setModalConfig({
          isOpen: true,
          message: 'Senha redefinida com sucesso!\nRedirecionando...',
          isSuccess: true
        });
      } else {
        setError(response.message || 'Erro ao alterar senha. Tente novamente.');
      }
    } catch (error) {
      setError('Erro ao alterar senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalConfig({ isOpen: false, message: '', isSuccess: false });
    navigate('/login');
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
                  Para redefinir sua senha, enviaremos um link<br />
                  de segurança para seu e-mail cadastrado.
                </p>
              </div>

              <div className="input-group">
                <input
                  type="email"
                  id="reset-password-email"
                  name="resetPasswordEmail"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && email && !isLoading) {
                      handleEmailSubmit();
                    }
                  }}
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
                {isLoading ? 'ENVIANDO...' : 'ENVIAR LINK'}
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

          {currentStep === 'emailSent' && (
            <div className="form-section">
              <div className="form-description">
                <p>
                  Email enviado com sucesso!<br />
                  Verifique sua caixa de entrada e clique no link recebido.
                </p>
              </div>

              <div className="success-message">
                <p>Se não recebeu o email, verifique sua pasta de spam.</p>
              </div>

              <button
                onClick={() => setLocalCurrentStep('email')}
                className="btn-primary"
              >
                ENVIAR NOVAMENTE
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

          {currentStep === 'resetPassword' && (
            <PasswordValidation
              password={newPassword}
              setPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              onAdvance={handlePasswordReset}
              onError={(message) => setError(message)}
              title="Crie uma nova senha para sua conta."
              showConfirmation={true}
            />
          )}
        </div>
      </div>
      
      {/* Modal de Sucesso/Erro */}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={handleModalClose}
        message={modalConfig.message}
        image={modalConfig.isSuccess ? SuccessImage : FailedIcon}
        buttonText="OK"
        autoClose={modalConfig.isSuccess}
        autoCloseTime={3000}
      />
    </div>
  );
};

export default ResetPasswordPage; 