import { useState } from 'react';

export const useVoucher = () => {
  const [voucherResgatado, setVoucherResgatado] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const handleConfirmar = () => {
    setVoucherResgatado(true);
  };

  const handleCopiarVoucher = async () => {
    try {
      await navigator.clipboard.writeText('ROCHEVOUCHER10');
      setCopiado(true);
      setTimeout(() => {
        setCopiado(false);
      }, 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  return {
    voucherResgatado,
    copiado,
    handleConfirmar,
    handleCopiarVoucher
  };
}; 