import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './LoginPage.scss';

import BemEspecialLoginDesktopLogo from '../../assets/images/Login_Desktop_Logo.png';
import BemEspecialLogin from '../../assets/images/Login_Desktop.png';
import BemEspecialLoginSenha from '../../assets/images/Login_Desktop_Senha.png';
import BemEspecialLoginSenhaInvalida from '../../assets/images/Login_Desktop_Senha_Invalida.png';

const BemEspecialLoginComponent = () => {
  const [currentStep, setCurrentStep] = useState('cpf');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityCode, setSecurityCode] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value);
    if (formatted.length <= 14) {
      setCpf(formatted);
    }
  };

  const handleSecurityCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...securityCode];
      newCode[index] = value;
      setSecurityCode(newCode);
      
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleAdvance = () => {
    if (currentStep === 'cpf' && cpf.length === 14) {
      setCurrentStep('password');
    } else if (currentStep === 'password' && password) {
      setCurrentStep('home');
    } else if (currentStep === 'resetPassword' && newPassword && confirmPassword) {
      setCurrentStep('password');
    } else if (currentStep === 'securityCode' && securityCode.every(digit => digit)) {
      setCurrentStep('resetPassword');
    }
  };

  const getBackgroundImage = () => {
    switch(currentStep) {
      case 'cpf':
        return BemEspecialLogin;
      case 'password':
        return BemEspecialLoginSenha;
      case 'resetPassword':
        return BemEspecialLoginSenha;
      case 'securityCode':
        return BemEspecialLoginSenha;
      default:
        return BemEspecialLogin;
    }
  };

  if (currentStep === 'home') {
    return (
      <div className="login-container home-background">
        <div className="login-card home-card">
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
    <div className="login-container" style={{ backgroundImage: `url(${getBackgroundImage()})` }}>
      <div className="login-overlay">
        <div className="login-card">
          <div className="logo-section">
            <img src={BemEspecialLoginDesktopLogo} alt="Bem Especial Logo" className="logo-image" />
            
          </div>

          {currentStep === 'cpf' && (
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
                  onChange={handleCPFChange}
                  className="input-field"
                />
              </div>

              <button
                onClick={handleAdvance}
                disabled={cpf.length !== 14}
                className="btn-primary"
              >
                AVANÇAR
              </button>

              <div className="form-footer">
                <button className="link-button">Voltar</button>
                <button 
                  onClick={() => setCurrentStep('resetPassword')}
                  className="link-button"
                >
                  Fazer cadastro
                </button>
              </div>
            </div>
          )}

          {currentStep === 'password' && (
            <div className="form-section">
              <div className="form-description">
                <p>
                  Notamos que você não cadastrou<br />
                  uma senha para acessar o sistema.<br />
                  Crie uma senha e confirme.
                </p>
              </div>

              <div className="input-group">
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Insira Senha aqui"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                <input
                  type="password"
                  placeholder="Confirme Senha aqui"
                  className="input-field"
                />
              </div>

              <button
                onClick={handleAdvance}
                disabled={!password}
                className="btn-primary"
              >
                AVANÇAR
              </button>

              <div className="password-requirements">
                <p className="requirements-title">A senha deve conter:</p>
                <ul className="requirements-list">
                  <li>• Mínimo de 6 caracteres</li>
                  <li>• Uma Letra minúscula</li>
                  <li>• Uma Letra maiúscula</li>
                  <li>• Número</li>
                  <li>• Caracter especial</li>
                </ul>
              </div>
            </div>
          )}

          {currentStep === 'resetPassword' && (
            <div className="form-section">
              <div className="form-description">
                <p>
                  Notamos que você não cadastrou<br />
                  uma senha para acessar o sistema.<br />
                  Crie uma senha e confirme.
                </p>
              </div>

              <div className="input-group">
                <input
                  type="password"
                  placeholder="Insira Senha aqui"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field"
                />
                
                <input
                  type="password"
                  placeholder="Confirme Senha aqui"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                />
              </div>

              <button
                onClick={handleAdvance}
                disabled={!newPassword || !confirmPassword}
                className="btn-primary"
              >
                AVANÇAR
              </button>

              <div className="password-requirements">
                <p className="requirements-title">A senha deve conter:</p>
                <ul className="requirements-list">
                  <li>• Mínimo de 6 caracteres</li>
                  <li>• Uma Letra minúscula</li>
                  <li>• Uma Letra maiúscula</li>
                  <li>• Número</li>
                  <li>• Caracter especial</li>
                </ul>
              </div>
            </div>
          )}

          {currentStep === 'securityCode' && (
            <div className="form-section">
              <div className="form-description">
                <p>
                  Por medida de segurança, enviamos no seu<br />
                  e-mail um código de 6 dígitos. Por favor, acesse<br />
                  o seu e-mail e insira o código no espaço abaixo.
                </p>
              </div>

              <div className="security-code-container">
                {securityCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleSecurityCodeChange(index, e.target.value)}
                    className="security-code-input"
                  />
                ))}
              </div>

              <button
                onClick={handleAdvance}
                disabled={!securityCode.every(digit => digit)}
                className="btn-primary"
              >
                AVANÇAR
              </button>
            </div>
          )}
            </div>
          </div>
        </div>
  );
};

export default BemEspecialLoginComponent;