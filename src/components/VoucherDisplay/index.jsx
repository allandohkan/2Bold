import React from 'react';
import '../../styles/components/_voucher.scss';

const VoucherDisplay = ({ copiado, onCopiar }) => {
  return (
    <div className="voucher-container">
      <div className="voucher-info">
        <input 
          type="text" 
          value="ROCHEVOUCHER10" 
          readOnly 
          className="voucher-input"
        />
        <button className="button-primary" onClick={onCopiar}>
          {copiado ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
      <p className="email-message">Um email foi enviado como voucher e para confirmação da transação</p>
      <button className="button-primary">Voltar</button>
    </div>
  );
};

export default VoucherDisplay; 