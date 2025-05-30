import React, { useState } from 'react';

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = () => {
    if (formData.name && formData.email && formData.message) {
      alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      setFormData({ name: '', email: '', message: '' });
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <h2>Entre em Contato</h2>
      
      <div>
        <div>
          <h3>Informações de Contato</h3>
          
          <div>
            <div>
              <span>Email:</span>
              <span>contato@minhaempresa.com</span>
            </div>
            <div>
              <span>Telefone:</span>
              <span>(11) 99999-9999</span>
            </div>
            <div>
              <span>WhatsApp:</span>
              <span>(11) 88888-8888</span>
            </div>
            <div>
              <span>Endereço:</span>
              <span>Rua das Empresas, 123<br />São Paulo - SP, 01234-567</span>
            </div>
          </div>
          
          <div>
            <h4>Horário de Atendimento</h4>
            <p>Segunda a Sexta: 8h às 18h</p>
            <p>Sábado: 8h às 12h</p>
          </div>
        </div>
        
        <div>
          <h3>Envie uma Mensagem</h3>
          
          <div>
            <div>
              <label>Nome</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label>Mensagem</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
              ></textarea>
            </div>
            
            <button onClick={handleSubmit}>
              Enviar Mensagem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;