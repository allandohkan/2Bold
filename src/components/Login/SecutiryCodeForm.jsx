import React, { useState, useEffect } from 'react';

const SecurityCodeForm = ({ 
  onAdvance,
  onResendCode,
  onBack,
  title = "Por medida de segurança, enviamos no seu e-mail um código de 6 dígitos. Por favor, acesse o seu e-mail e insira o código no espaço abaixo.",
  isLoading = false 
}) => {
  const [securityCode, setSecurityCode] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSecurityCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...securityCode];
      newCode[index] = value;
      setSecurityCode(newCode);
      setError('');

      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Enter' && isCodeComplete && !isLoading) {
      handleSubmit();
    } else if (e.key === 'Backspace' && !securityCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    } else if (e.key === 'Delete') {
      const newCode = [...securityCode];
      newCode[index] = '';
      setSecurityCode(newCode);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    
    if (pastedData.length === 6) {
      const newCode = pastedData.split('');
      setSecurityCode(newCode);
      setError('');

      const lastInput = document.getElementById('code-5');
      lastInput?.focus();
    }
  };

  const handleSubmit = async () => {
    const code = securityCode.join('');
    
    if (code.length !== 6) {
      setError('Por favor, insira o código completo de 6 dígitos.');
      return;
    }

    try {
      if (onAdvance) {
        await onAdvance(code);
      }
    } catch (error) {
      setError('Código inválido. Tente novamente.');
      setSecurityCode(['', '', '', '', '', '']);
      const firstInput = document.getElementById('code-0');
      firstInput?.focus();
    }
  };

  const handleResendCode = async () => {
    try {
      if (onResendCode) {
        await onResendCode();
      }

      setTimeLeft(300);
      setCanResend(false);
      setSecurityCode(['', '', '', '', '', '']);
      setError('');
      
      const firstInput = document.getElementById('code-0');
      firstInput?.focus();
      
    } catch (error) {
      setError('Erro ao reenviar código. Tente novamente.');
    }
  };

  const isCodeComplete = securityCode.every(digit => digit);

  return (
    <div className="form-section" role="main">
      <div className="form-description">
        <p>{title}</p>
      </div>

      <fieldset className="security-code-container">
        <legend className="sr-only">Código de validação</legend>
        <label htmlFor="code-0" className="sr-only">
          Código de validação de 6 dígitos
        </label>
        {securityCode.map((digit, index) => (
          <input
            key={index}
            id={`code-${index}`}
            name={`securityCode-${index}`}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            onChange={(e) => handleSecurityCodeChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            className={`security-code-input ${error ? 'error' : ''}`}
            disabled={isLoading}
            aria-describedby={error ? "code-error" : undefined}
            aria-invalid={!!error}
            aria-required="true"
            aria-label={`Dígito ${index + 1} do código`}
          />
        ))}
      </fieldset>

      {error && (
        <div id="code-error" className="error-message" role="alert" aria-live="polite">
          <p>{error}</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!isCodeComplete || isLoading}
        className="btn-primary"
      >
        {isLoading ? 'VERIFICANDO...' : 'AVANÇAR'}
      </button>

      <div className="form-footer">
        {onBack && (
          <button 
            onClick={onBack}
            className="link-button"
            disabled={isLoading}
          >
            Voltar
          </button>
        )}
        {!canResend ? (
          <p>Reenviar código em: <strong>{formatTime(timeLeft)}</strong></p>
        ) : (
          <button 
            onClick={handleResendCode}
            className="link-button"
            disabled={isLoading}
          >
            Reenviar código
          </button>
        )}
      </div>
    </div>
  );
};

export default SecurityCodeForm;