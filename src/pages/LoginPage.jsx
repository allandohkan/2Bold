import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CPFValidation from '../components/Login/CPFValidation.jsx';
import PasswordValidation from '../components/Login/PasswordValidation.jsx';
import SecurityCodeForm from '../components/Login/SecutiryCodeForm.jsx';
import Modal from '../components/Modal.jsx';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

import BemEspecialLoginDesktopLogo from '../assets/images/Login_Desktop_Logo.png';
import BemEspecialLogin from '../assets/images/Login_Desktop.png';
import BemEspecialLoginSenha from '../assets/images/Login_Desktop_Senha.png';
import FailedIcon from '../assets/images/failed-icon.png';
import SuccessImage from '../assets/images/success-icon.png';

const BemEspecialLoginComponent = () => {
  const { currentStep, setCurrentStep, autenticarUsuario, cadastrarSenha, validarCodigo, reenviarCodigo, isFullyAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalError, setModalError] = useState({ isOpen: false, message: '' });
  const [modalSuccess, setModalSuccess] = useState({ isOpen: false, message: '' });
  const [currentBackground, setCurrentBackground] = useState(BemEspecialLogin);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Redirecionar se o usuário estiver autenticado
  useEffect(() => {
    if (isFullyAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isFullyAuthenticated, navigate]);

  // CURRENT STEP CODE - REENVIAR CÓDIGO AUTOMATICAMENTE
  useEffect(() => {
    if (currentStep === 'code') {
      
      const autoResendCode = async () => {
        try {
          const response = await reenviarCodigo();
          if (!response.success) {
            setModalError({
              isOpen: true,
              message: response.message || 'Erro ao enviar código. Tente novamente.'
            });
          }
        } catch (error) {
          setModalError({
            isOpen: true,
            message: 'Erro ao enviar código. Tente novamente.'
          });
        }
      };
      
      // Executar com um pequeno delay para garantir que a tela já foi renderizada
      setTimeout(autoResendCode, 500);
    }
  }, [currentStep, reenviarCodigo]);

  // TROCA DE BACKGROUND COM TRANSIÇÃO
  useEffect(() => {
    const newBackground = getBackgroundImage(currentStep);
    
    if (!isInitialized) {
      setCurrentBackground(newBackground);
      setIsInitialized(true);
      return;
    }
    
    if (newBackground !== currentBackground && !isTransitioning) {
      // Primeiro: iniciar fade-out do background atual
      setIsTransitioning(true);
      
      // Após o fade-out terminar (250ms), trocar o background e iniciar fade-in
      setTimeout(() => {
        setCurrentBackground(newBackground);
        
        // Após o fade-in terminar (250ms), finalizar a transição
        setTimeout(() => {
          setIsTransitioning(false);
        }, 0);
      }, 150);
    }
  }, [currentStep, isInitialized]);

  const handleCPFAdvance = () => {
    setCurrentStep('password');
  };

  const handleSecurityCodeValidation = async (code) => {
    setIsLoading(true);
    try {
      const response = await validarCodigo(code);
      if (response.success) {
        // Código validado com sucesso, usuário autenticado
        setCurrentStep('authenticated');
      } else {
        // Não mostrar modal, apenas lançar erro para o componente tratar
        throw new Error(response.message || 'Código inválido.');
      }
    } catch (error) {
      // O componente SecurityCodeForm já lida com o erro
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para reenviar código de segurança
  const handleResendSecurityCode = async () => {
    try {
      const response = await reenviarCodigo();
      if (response.success) {
        setModalSuccess({
          isOpen: true,
          message: 'Novo código enviado para seu e-mail!'
        });
      } else {
        // Não mostrar modal de erro, apenas lançar erro para o componente tratar
        throw new Error(response.message || 'Erro ao reenviar código.');
      }
    } catch (error) {
      // Não mostrar modal de erro, apenas lançar erro para o componente tratar
      throw new Error('Erro ao reenviar código. Tente novamente.');
    }
  };

  const handleAdvance = async () => {
    if (currentStep === 'password') {
      try {
        const response = await autenticarUsuario(password);
        if (response.success) {
          setCurrentStep('authenticated');
        } else if (response.needsCodeValidation) {
          // Usuário precisa validar código - não mostrar erro, já foi redirecionado
        } else {
          setModalError({
            isOpen: true,
            message: response.message || 'CPF ou senha incorreto!'
          });
        }
      } catch (error) {
        setModalError({
          isOpen: true,
          message: 'Erro ao fazer login. Tente novamente.'
        });
      }
    }
  };

  const handlePasswordCreate = async () => {
    try {
      const response = await cadastrarSenha(newPassword, confirmPassword);
      if (response.success) {
        // Senha cadastrada com sucesso, agora vai para validação de código
        setCurrentStep('code');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        // Mostrar erro
        setModalError({
          isOpen: true,
          message: response.message || 'Erro ao cadastrar senha.'
        });
      }
    } catch (error) {
      setModalError({
        isOpen: true,
        message: 'Erro ao cadastrar senha. Tente novamente.'
      });
    }
  };

  // RESETAR SENHA VIA API
  const handlePasswordReset = () => {
    setCurrentStep('password');
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleForgotPassword = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.resetSenha(email);
      
      if (response.success === 1) {
        setCurrentStep('emailSent');
      } else {
        setModalError({
          isOpen: true,
          message: response.message || 'Erro ao enviar email. Tente novamente.'
        });
      }
    } catch (error) {
      setModalError({
        isOpen: true,
        message: 'Erro ao enviar email. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getBackgroundImage = (currentStep) => {
    switch(currentStep) {
      case 'cpf':
        return BemEspecialLogin;
      case 'password':
      case 'resetPassword':
      case 'securityCode':
      case 'code':
      case 'createPassword':
      case 'forgotPassword':
      case 'emailSent':
        return BemEspecialLoginSenha;
      default:
        return BemEspecialLogin;
    }
  };

  return (
    <div className="login-container">
      {/* Background único com transição */}
      <div 
        className={`login-background ${isTransitioning ? 'fade-out' : 'fade-in'}`}
        style={{ 
          backgroundImage: `url(${currentBackground})`,
          zIndex: 2
        }}
      />
      
      <div className="login-overlay">
        <div className="login-card">
          <div className="logo-login-section">
            <img 
              src={BemEspecialLoginDesktopLogo} 
              alt="Bem Especial Logo" 
              className="logo-image" 
            />
          </div>

          {currentStep === 'cpf' && (
            <CPFValidation 
              cpf={cpf} 
              setCpf={setCpf} 
              onGoToPassword={() => setCurrentStep('password')}
              onGoToRegisterPassword={() => setCurrentStep('createPassword')}
            />
          )}

          {currentStep === 'password' && (
            <div className="form-section">
              <div className="form-description">
                <p>Para avançar, insira <br />
                a senha cadastrada. </p>
              </div>

              <div className="input-group">
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="login-password-input"
                    name="loginPassword"
                    placeholder="Insira Senha aqui"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAdvance();
                      }
                    }}
                    className="password-input__field"
                  />
                  <button
                    type="button"
                    tabIndex="-1"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-input__toggle"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdvance}
                disabled={!password}
                className="btn-primary"
              >
                ENTRAR
              </button>

              <div className="forgot-password-link">
                <p>
                  Esqueceu a senha? Clique{' '}
                  <button 
                    onClick={() => setCurrentStep('forgotPassword')}
                    className="link-button"
                  >
                    aqui
                  </button>
                  .
                </p>
              </div>

              <div className="form-footer">
                <button 
                  onClick={() => setCurrentStep('cpf')}
                  className="link-button"
                >
                  Voltar
                </button>
              </div>
            </div>
          )}

          {currentStep === 'createPassword' && (
            <PasswordValidation
              password={newPassword}
              setPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              onAdvance={handlePasswordCreate}
              onBack={() => setCurrentStep('cpf')}
              title="Notamos que você não cadastrou 
uma senha para acessar o sistema. Crie uma senha e confirme."
              showConfirmation={true}
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

          {currentStep === 'forgotPassword' && (
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
                  id="forgot-password-email"
                  name="forgotPasswordEmail"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && email && !isLoading) {
                      handleForgotPassword();
                    }
                  }}
                  className="input-field"
                />
              </div>

              <button
                onClick={handleForgotPassword}
                disabled={!email || isLoading}
                className="btn-primary"
              >
                {isLoading ? 'ENVIANDO...' : 'ENVIAR LINK'}
              </button>

              <div className="form-footer">
                <button 
                  onClick={() => setCurrentStep('cpf')}
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
                onClick={() => setCurrentStep('forgotPassword')}
                className="btn-primary"
              >
                ENVIAR NOVAMENTE
              </button>

              <div className="form-footer">
                <button 
                  onClick={() => setCurrentStep('cpf')}
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
              onBack={() => setCurrentStep('forgotPassword')}
              email={email}
              isLoading={isLoading}
            />
          )}

          {currentStep === 'code' && (
            <SecurityCodeForm
              onAdvance={handleSecurityCodeValidation}
              onResendCode={handleResendSecurityCode}
              onBack={() => setCurrentStep('createPassword')}
              title="Para completar seu acesso, é necessário validar o código enviado para seu e-mail. Por favor, acesse o seu e-mail e insira o código de 6 dígitos no espaço abaixo."
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
      
      {/* Modal de Erro */}
      <Modal
        isOpen={modalError.isOpen}
        onClose={() => setModalError({ isOpen: false, message: '' })}
        message={modalError.message}
        image={FailedIcon}
        buttonText="Voltar"
      />
      
      {/* Modal de Sucesso */}
      <Modal
        isOpen={modalSuccess.isOpen}
        onClose={() => setModalSuccess({ isOpen: false, message: '' })}
        message={modalSuccess.message}
        image={SuccessImage}
        buttonText="OK"
        autoClose={true}
        autoCloseTime={3000}
      />
    </div>
  );
};

export default BemEspecialLoginComponent;