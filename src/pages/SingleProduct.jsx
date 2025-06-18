import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DefaultPageContainer from '../layouts/Containers/DefaultPageContainer';

const SingleProduct = () => {
  const { nome } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [isRedeemed, setIsRedeemed] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  // TODO: Substituir por valor da API quando estiver pronta
  const rating = 4; // Valor temporário para demonstração
  const userPoints = 1000; // TODO: Substituir por valor da API
  const productPoints = 500; // TODO: Substituir por valor da API

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);
        const details = await response.json();
        setProduto(details);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      }
    };

    fetchProduto();
  }, [nome]);

  const handleConfirm = () => {
    // TODO: Implementar verificação real de pontos
    if (userPoints >= productPoints) {
      setIsRedeemed(true);
    } else {
      alert('Pontos insuficientes para resgatar este produto');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('ROCHEVOUCHER10');
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 7000);
  };

  if (!produto) return <p>Carregando...</p>;

  return (
    <DefaultPageContainer title={isRedeemed ? "Transação Confirmada" : "Produtos"}>
      <div className="single-product">
        {isRedeemed && (
          <div className="success-row">
            <div className="success-message">
              Parabéns! Sua transação foi confirmada com sucesso para a troca de pontos. Seu saldo também foi atualizado
            </div>
            
          </div>
        )}
        <div className="product-main">
          <div className="product-image">
            <img src={produto.sprites.front_default} alt={produto.name} />
          </div>
          <div className="product-info">
            <div className="points">00000 pts</div>
            <div className="product-title">{produto.name}</div>
            <div className="product-description">
              Este produto oferece desempenho superior com design inovador, garantindo praticidade e eficiência no seu dia a dia. Ideal para quem busca qualidade e resultados rápidos.
            </div>
            <div className="rating">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <span
                    key={index}
                    className="star"
                    style={{
                      color: ratingValue <= rating ? '#8D4B91' : '#ccc'
                    }}
                  >
                    ★
                  </span>
                );
              })}
            </div>
            <div className='sku'>SKU: {produto.base_experience}</div>
            {!isRedeemed && (
              <div className="action-buttons">
                <button className="confirm-button" onClick={handleConfirm}>
                  Confirmar
                </button>
                <button className="back-button" onClick={() => navigate('/resgatar')}>
                  Voltar
                </button>
              </div>
            )}
          </div>
        </div>
        <hr className="divider" />
        {!isRedeemed ? (
          <div className="how-it-works">
            <h2>Como Funciona</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
        ) : (
          <div className="voucher-section">
            <div className="voucher-info">
              <input 
                type="text" 
                value="ROCHEVOUCHER10" 
                readOnly 
                className="voucher-input"
              />
              <button 
                className="copy-button" 
                onClick={handleCopy}
              >
                {showCopied ? 'Copiado!' : 'Copiar'}
              </button>
              <span className="email-message">
                Um e-mail foi enviado como voucher e para confirmação da transação.
              </span>
            </div>
            <button className="exit-button" onClick={() => navigate('/resgatar')}>
              Sair
            </button>
          </div>
        )}
      </div>
    </DefaultPageContainer>
  );
};

export default SingleProduct;
