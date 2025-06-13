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

const CPFValidation = ({ cpf, setCpf, onAdvance }) => {
  const handleChange = (e) => {
    const formatted = formatCPF(e.target.value);
    if (formatted.length <= 14) {
      setCpf(formatted);
    }
  };

  const handleSubmit = () => {
    if (isValidCPF(cpf)) {
      onAdvance();
    } else {
      alert('CPF inválido. Verifique os números digitados.');
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
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={cpf.length !== 14}
        className="btn-primary"
      >
        AVANÇAR
      </button>
    </div>
  );
};

export default CPFValidation;