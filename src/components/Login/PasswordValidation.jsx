import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordValidation = ({ 
  password, 
  setPassword, 
  confirmPassword, 
  setConfirmPassword, 
  onAdvance,
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

  const handleSubmit = () => {
    const validation = validatePassword(password);
    
    if (!validation.isValid) {
      alert('Senha não atende aos requisitos mínimos!');
      return;
    }

    if (showConfirmation && !confirmPassword) {
      alert('Por favor, confirme a senha!');
      return;
    }

    onAdvance();
  };

  const validation = validatePassword(password);
  const isFormValid = validation.isValid && (!showConfirmation || password === confirmPassword);

  return (
    <div className="password-validation">
      <div className="password-validation__description">
        <p>{title}</p>
      </div>

      <div className="password-validation__inputs">
        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Insira Senha aqui"
            value={password}
            onChange={handlePasswordChange}
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
        
        {showConfirmation && (
          <div className="password-input">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirme Senha aqui"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="password-input__field"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="password-input__toggle"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        )}
      </div>

      {showConfirmation && confirmPassword && password !== confirmPassword && (
        <div className="password-validation__error">
          <p>⚠️ As senhas não coincidem</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!password || (showConfirmation && !confirmPassword)}
        className="password-validation__submit"
      >
        AVANÇAR
      </button>

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