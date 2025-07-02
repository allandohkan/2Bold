import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DefaultPageContainer from '../layouts/Containers/DefaultPageContainer';
import ErrorImage from '../assets/images/failed-icon.png';
import Modal from '../components/Modal';
import { useAuth } from '../contexts/AuthContext';

const SingleProduct = () => {
  const { nome } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRedeemed, setIsRedeemed] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [confirming, setConfirming] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  
  const { user, listarProdutos, meusPontos, resgatarVoucher, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };
  
  const [userPoints, setUserPoints] = useState(0);
  const [productPoints, setProductPoints] = useState(0);

  // Ler quantidade da URL e definir estado inicial
  useEffect(() => {
    const qtyFromUrl = searchParams.get('qty');
    if (qtyFromUrl) {
      const quantity = parseInt(qtyFromUrl);
      if (quantity >= 1 && quantity <= 3) {
        setSelectedQuantity(quantity);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProduto = async () => {
      if (!user?.idparticipante) {
        setError('Usuário não identificado');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // Buscar todos os produtos para encontrar o específico
        const response = await listarProdutos(user.idparticipante);
        
        if (response.success && response.data) {
          // Encontrar o produto pelo nome
          const produtoEncontrado = response.data.find(
            p => p.nomeproduto === decodeURIComponent(nome)
          );
          
          if (produtoEncontrado) {
            setProduto(produtoEncontrado);
            // Definir pontos iniciais baseado na quantidade selecionada
            const pointsKey = `pontos_qtd_${selectedQuantity}`;
            setProductPoints(produtoEncontrado[pointsKey] || produtoEncontrado.pontos_qtd_1 || 0);
          } else {
            setError('Produto não encontrado');
          }
        } else {
          setError(response.message || 'Erro ao carregar produtos');
        }
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
        setError('Erro de comunicação. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserPoints = async () => {
      if (user?.idparticipante) {
        try {
          const response = await meusPontos(user.idparticipante);
          if (response.success && response.data) {
            setUserPoints(response.data.saldo || 0);
          }
        } catch (error) {
          console.error('Erro ao buscar pontos do usuário:', error);
        }
      }
    };

    fetchProduto();
    fetchUserPoints();
  }, [nome, user?.idparticipante, listarProdutos, meusPontos]);

  // Atualizar pontos quando a quantidade mudar (sem recarregar o produto)
  useEffect(() => {
    if (produto) {
      const pointsKey = `pontos_qtd_${selectedQuantity}`;
      setProductPoints(produto[pointsKey] || produto.pontos_qtd_1 || 0);
    }
  }, [selectedQuantity, produto]);

  const handleQuantitySelect = (quantity) => {
    setSelectedQuantity(quantity);
  };

  const handleConfirm = async () => {
    if (userPoints >= productPoints) {
      setConfirming(true);
      try {

        
        const response = await resgatarVoucher(user.idparticipante, produto.idproduto, selectedQuantity);

        
        if (response.success && response.data) {
          setIsRedeemed(true);
          // A API retorna o código do voucher em response.data.codigovoucher
          setVoucherCode(response.data.codigovoucher || 'ROCHEVOUCHER10');
        } else {
          setError(response.message || 'Erro ao resgatar voucher');
        }
      } catch (error) {
        console.error('Erro ao resgatar voucher:', error);
        setError('Erro ao resgatar voucher. Tente novamente mais tarde.');
      } finally {
        setConfirming(false);
      }
    } else {
      setShowErrorModal(true);
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(voucherCode);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 7000);
  };

  if (loading) {
    return (
      <DefaultPageContainer title="Produtos" onLogout={handleLogout}>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Carregando produto...</span>
        </div>
      </DefaultPageContainer>
    );
  }

  if (error || !produto) {
    return (
      <DefaultPageContainer title="Produtos" onLogout={handleLogout}>
        <div className="not-found text-center py-12">
          <p className="text-red-600 mb-4">{error || 'Produto não encontrado'}</p>
          <button 
            onClick={() => navigate('/resgatar')}
            className="btn-primary m-0"
          >
            Voltar aos Produtos
          </button>
        </div>
      </DefaultPageContainer>
    );
  }

  return (
    <DefaultPageContainer title={isRedeemed ? "Transação Confirmada" : "Produtos"} onLogout={handleLogout}>
      <Modal
        isOpen={showErrorModal}
        onClose={handleCloseErrorModal}
        message="Ops! Saldo insuficiente para essa transação"
        image={ErrorImage}
        buttonText="Voltar"
      />
      <Modal
        isOpen={!!error}
        onClose={() => setError(null)}
        message={error}
        image={ErrorImage}
        buttonText="OK"
      />
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
            <img src={produto.caminhofoto} alt={produto.nomeproduto} />
          </div>
          <div className="product-info">
            <div className="points">{productPoints} pts</div>
            <div className="product-title">{produto.nomeproduto}</div>
            <div className="product-description">
              {produto.descricaoproduto}
            </div>
            <div className='sku'>SKU: {produto.sku}</div>
            
            {/* Botões de quantidade */}
            <div className="quantity-selector">
              <h3>Escolha a quantidade:</h3>
              <div className="quantity-buttons">
                <button 
                  className={`quantity-btn ${selectedQuantity === 1 ? 'active' : ''}`}
                  onClick={() => handleQuantitySelect(1)}
                >
                  1 Unidade
                </button>
                <button 
                  className={`quantity-btn ${selectedQuantity === 2 ? 'active' : ''}`}
                  onClick={() => handleQuantitySelect(2)}
                >
                  2 Unidades
                </button>
                <button 
                  className={`quantity-btn ${selectedQuantity === 3 ? 'active' : ''}`}
                  onClick={() => handleQuantitySelect(3)}
                >
                  3 Unidades
                </button>
              </div>
            </div>
            
            {!isRedeemed && (
              <div className="action-buttons">
                <button 
                  className="confirm-button" 
                  onClick={handleConfirm}
                  disabled={confirming}
                >
                  {confirming ? 'Processando...' : 'Confirmar'}
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
                value={voucherCode} 
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

      <style>{`
        .quantity-selector {
          margin: 20px 0;
        }
        
        .quantity-selector h3 {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 12px;
        }
        
        .quantity-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        
        .quantity-btn {
          padding: 12px 20px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          background: white;
          color: #666;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 120px;
          text-align: center;
        }
        
        .quantity-btn:hover {
          border-color: #8D4B91;
          color: #8D4B91;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(141, 75, 145, 0.15);
        }
        
        .quantity-btn.active {
          border-color: #8D4B91;
          background: #8D4B91;
          color: white;
          box-shadow: 0 4px 12px rgba(141, 75, 145, 0.3);
        }
        
        .quantity-btn.active:hover {
          background: #7a3f7e;
          transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
          .quantity-buttons {
            flex-direction: column;
            gap: 8px;
          }
          
          .quantity-btn {
            min-width: auto;
            width: 100%;
          }
        }
      `}</style>
    </DefaultPageContainer>
  );
};

export default SingleProduct;
