import React, { useState } from 'react';
import CPFValidation from '../../components/Login/CPFValidation.jsx';
import PasswordValidation from '../../components/Login/PasswordValidation.jsx';
import SecurityCodeForm from '../../components/Login/SecutiryCodeForm.jsx';
import { Eye, EyeOff } from 'lucide-react';
import './LoginPage.scss';

import BemEspecialLoginDesktopLogo from '../../assets/images/Login_Desktop_Logo.png';
import BemEspecialLogin from '../../assets/images/Login_Desktop.png';
import BemEspecialLoginSenha from '../../assets/images/Login_Desktop_Senha.png';
import BemEspecialLoginSenhaInvalida from '../../assets/images/Login_Desktop_Senha_Invalida.png';

const BemEspecialLoginComponent = ({ onLogin }) => {
  const [currentStep, setCurrentStep] = useState('cpf');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCPFAdvance = () => {
    setCurrentStep('password');
  };


  const handleSecurityCodeValidation = async (code) => {
    setIsLoading(true);
    try {
      // Aqui você fará a chamada para a API para validar o código
      // const response = await validateSecurityCode(code, email);
      
      // Simula validação por enquanto
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Se chegou até aqui, código está correto
      alert('Código verificado com sucesso!');
      setCurrentStep('resetPassword');
    } catch (error) {
      // O componente SecurityCodeForm já lida com o erro
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para reenviar código de segurança
  const handleResendSecurityCode = async (email) => {
    try {
      // chamada para a API para reenviar o código
      // const response = await resendSecurityCode(email);
      
      // Simula envio por enquanto
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Novo código enviado para seu e-mail!');
    } catch (error) {
      throw new Error('Erro ao reenviar código');
    }
  };

  const handleAdvance = () => {
    if (currentStep === 'password' && password) {
      if (onLogin) {
        const loginSuccess = onLogin(cpf, password);
        if (loginSuccess) {
          setCurrentStep('home');
        } else {
          alert('Credenciais inválidas!');
        }
      } else {
        setCurrentStep('home');
      }
    } else if (currentStep === 'forgotPassword') {
      handleForgotPassword();
    }
  };

  const handlePasswordCreate = () => {
    alert('Senha criada com sucesso! Agora faça login.');
    setCurrentStep('password');
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };


  const handlePasswordReset = () => {
    // resetar a senha via API
    alert('Senha alterada com sucesso! Agora faça login.');
    setCurrentStep('password');
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleForgotPassword = async () => {
    setIsLoading(true);
    try {
      // chamada para a API para enviar código por email
      // const response = await sendSecurityCode(email);
      
      // Simula envio por enquanto
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Código de segurança enviado para seu e-mail!');
      setCurrentStep('securityCode');
    } catch (error) {
      alert('Erro ao enviar código. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getBackgroundImage = () => {
    switch(currentStep) {
      case 'cpf':
        return BemEspecialLogin;
      case 'password':
      case 'resetPassword':
      case 'securityCode':
        return BemEspecialLoginSenha;
      default:
        return BemEspecialLogin;
    }
  };

  if (currentStep === 'home') {
    return (
      <div className="login-container login-container--home">
        <div className="login-card login-card--home">
          <div className="logo-section">
            <h1 className="logo-text">
              BEM<br />ESPECIAL
            </h1>
          </div>
          <h2 className="welcome-title">Bem-vindo!</h2>
          <p className="welcome-message">Login realizado com sucesso.</p>
          <button 
            onClick={() => setCurrentStep('cpf')}
            className="btn-primary"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="login-container" 
      style={{ backgroundImage: `url(${getBackgroundImage()})` }}
    >
      <div className="login-overlay">
        <div className="login-card">
          <div className="logo-section">
            <img 
              src={BemEspecialLoginDesktopLogo} 
              alt="Bem Especial Logo" 
              className="logo-image" 
            />
          </div>

          {currentStep === 'cpf' && (
            <>
              <CPFValidation 
                cpf={cpf} 
                setCpf={setCpf} 
                onAdvance={handleCPFAdvance}
              />
              <div className="form-footer">
                <button className="link-button">Voltar</button>
                <button 
                  onClick={() => setCurrentStep('createPassword')}
                  className="link-button"
                >
                  Fazer cadastro
                </button>
              </div>
            </>
          )}

          {currentStep === 'password' && (
            <div className="form-section">
              <div className="form-description">
                <p>Digite sua senha para continuar</p>
              </div>

              <div className="input-group">
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Insira Senha aqui"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="password-input__field"
                  />
                  <button
                    type="button"
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

              <div className="form-footer">
                <button 
                  onClick={() => setCurrentStep('forgotPassword')}
                  className="link-button"
                >
                  Esqueci minha senha
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
              title="Notamos que você não cadastrou uma senha para acessar o sistema. Crie uma senha e confirme."
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
                  Para recuperar sua senha, enviaremos um código<br />
                  de segurança para seu e-mail cadastrado.
                </p>
              </div>

              <div className="input-group">
                <input
                  type="email"
                  placeholder="Confirme seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
              </div>

              <button
                onClick={handleAdvance}
                disabled={!email || isLoading}
                className="btn-primary"
              >
                {isLoading ? 'ENVIANDO...' : 'ENVIAR CÓDIGO'}
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
        </div>
      </div>
    </div>
  );
};

export default BemEspecialLoginComponent;