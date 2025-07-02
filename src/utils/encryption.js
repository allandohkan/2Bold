import CryptoJS from 'crypto-js';

// Gerar uma chave única baseada no domínio e timestamp da sessão
const generateSecretKey = () => {
  const domain = window.location.hostname;
  const sessionId = sessionStorage.getItem('sessionId') || Date.now().toString();
  
  // Salvar sessionId se não existir
  if (!sessionStorage.getItem('sessionId')) {
    sessionStorage.setItem('sessionId', sessionId);
  }
  
  // Combinar domínio + sessionId + uma string secreta
  return CryptoJS.SHA256(`${domain}-${sessionId}-bem-especial-2024`).toString();
};

// Verificar se o browser suporta criptografia
const isEncryptionSupported = () => {
  try {
    return typeof CryptoJS !== 'undefined' && 
           typeof CryptoJS.AES !== 'undefined' &&
           typeof window !== 'undefined';
  } catch (error) {
    return false;
  }
};

// Criptografar dados
export const encryptData = (data) => {
  try {
    if (!isEncryptionSupported()) {
      console.warn('Criptografia não suportada, usando armazenamento não criptografado');
      return JSON.stringify(data);
    }
    
    const secretKey = generateSecretKey();
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, secretKey).toString();
    
    return encrypted;
  } catch (error) {
    console.warn('Erro na criptografia, usando armazenamento não criptografado:', error);
    return JSON.stringify(data);
  }
};

// Descriptografar dados
export const decryptData = (encryptedData) => {
  try {
    if (!isEncryptionSupported()) {
      // Tentar fazer parse como JSON normal
      return JSON.parse(encryptedData);
    }
    
    // Verificar se é um JSON válido (dados não criptografados)
    try {
      return JSON.parse(encryptedData);
    } catch {
      // Se não for JSON válido, tentar descriptografar
      const secretKey = generateSecretKey();
      const decrypted = CryptoJS.AES.decrypt(encryptedData, secretKey);
      const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!jsonString) {
        throw new Error('Falha na descriptografia');
      }
      
      return JSON.parse(jsonString);
    }
  } catch (error) {
    console.warn('Erro na descriptografia:', error);
    return null;
  }
};

// Limpar dados criptografados
export const clearEncryptedData = () => {
  try {
    sessionStorage.removeItem('sessionId');
  } catch (error) {
    console.warn('Erro ao limpar dados de sessão:', error);
  }
}; 