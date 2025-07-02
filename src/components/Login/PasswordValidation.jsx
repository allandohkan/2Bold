import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordValidation = ({ 
  password, 
  setPassword, 
  confirmPassword, 
  setConfirmPassword, 
  onAdvance,
  onError,
  onBack,
  title = "Notamos que você não cadastrou uma senha para acessar o sistema. Crie uma senha e confirme.",
  showConfirmation = true 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState([]);

  const validatePassword = (pwd) => {
    const validations = {
      minLength: pwd.length >= 6,
      hasLowerCase: /[a-z]/.test(pwd),
      hasUpperCase: /[A-Z]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    };

    const errorMessages = [];
    if (!validations.minLength) errorMessages.push('Mínimo de 6 caracteres');
    if (!validations.hasLowerCase) errorMessages.push('Uma letra minúscula');
    if (!validations.hasUpperCase) errorMessages.push('Uma letra maiúscula');
    if (!validations.hasNumber) errorMessages.push('Um número');
    if (!validations.hasSpecialChar) errorMessages.push('Um caractere especial');

    return {
      isValid: Object.values(validations).every(v => v),
      errors: errorMessages,
      validations
    };
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    if (newPassword) {
      const validation = validatePassword(newPassword);
      setErrors(validation.errors);
    } else {
      setErrors([]);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isFormValid) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const validation = validatePassword(password);
    
    if (!validation.isValid) {
      if (onError) {
        onError('Senha não atende aos requisitos mínimos!');
      } else {
        
      }
      return;
    }

    if (showConfirmation && !confirmPassword) {
      if (onError) {
        onError('Por favor, confirme a senha!');
      } 
      return;
    }

    onAdvance();
  };

  const validation = validatePassword(password);
  const isFormValid = validation.isValid && (!showConfirmation || password === confirmPassword);

  return (
    <div className="password-validation" role="main">
      <div className="password-validation__description">
        <p>{title}</p>
      </div>

      <fieldset className="password-validation__inputs">
        <legend className="sr-only">Criação de senha</legend>
        <div className="password-input">
          <label htmlFor="password-input" className="sr-only">
            Senha
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password-input"
            name="password"
            placeholder="Insira Senha aqui"
            value={password}
            onChange={handlePasswordChange}
            onKeyDown={handleKeyPress}
            className="password-input__field"
            aria-describedby={errors.length > 0 ? "password-errors" : undefined}
            aria-invalid={errors.length > 0}
            aria-required="true"
          />
          <button
            type="button"
            tabIndex="-1"
            onClick={() => setShowPassword(!showPassword)}
            className="password-input__toggle"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        {showConfirmation && (
          <div className="password-input">
            <label htmlFor="confirm-password-input" className="sr-only">
              Confirmar senha
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password-input"
              name="confirmPassword"
              placeholder="Confirme Senha aqui"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onKeyDown={handleKeyPress}
              className="password-input__field"
              aria-describedby={confirmPassword && password !== confirmPassword ? "password-mismatch" : undefined}
              aria-invalid={confirmPassword && password !== confirmPassword}
              aria-required="true"
            />
            <button
              type="button"
              tabIndex="-1"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="password-input__toggle"
              aria-label={showConfirmPassword ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        )}
      </fieldset>

      {showConfirmation && confirmPassword && password !== confirmPassword && (
        <div id="password-mismatch" className="password-validation__error" role="alert" aria-live="polite">
          <p>As senhas não coincidem</p>
        </div>
      )}

      {errors.length > 0 && (
        <div id="password-errors" className="password-validation__error" role="alert" aria-live="polite">
          <p>Senha não atende aos requisitos mínimos</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!password || (showConfirmation && !confirmPassword)}
        className="password-validation__submit"
      >
        AVANÇAR
      </button>

      {onBack && (
        <div className="form-footer">
          <button 
            onClick={onBack}
            className="link-button"
          >
            Voltar
          </button>
        </div>
      )}

      <div className="password-requirements">
        <p className="password-requirements__title">A senha deve conter:</p>
        <ul className="password-requirements__list">
          <li className={`password-requirements__item ${validation.validations.minLength ? 'valid' : 'invalid'}`}>
            {validation.validations.minLength ? '✓' : '•'} Mínimo de 6 caracteres
          </li>
          <li className={`password-requirements__item ${validation.validations.hasLowerCase ? 'valid' : 'invalid'}`}>
            {validation.validations.hasLowerCase ? '✓' : '•'} Uma Letra minúscula
          </li>
          <li className={`password-requirements__item ${validation.validations.hasUpperCase ? 'valid' : 'invalid'}`}>
            {validation.validations.hasUpperCase ? '✓' : '•'} Uma Letra maiúscula
          </li>
          <li className={`password-requirements__item ${validation.validations.hasNumber ? 'valid' : 'invalid'}`}>
            {validation.validations.hasNumber ? '✓' : '•'} Número
          </li>
          <li className={`password-requirements__item ${validation.validations.hasSpecialChar ? 'valid' : 'invalid'}`}>
            {validation.validations.hasSpecialChar ? '✓' : '•'} Caracter especial (!@#$%^&*...)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordValidation;