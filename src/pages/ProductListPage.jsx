import React, { useState, useEffect } from 'react';
import PageContainer from '../layouts/Containers/DefaultPageContainer.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedQuantities, setSelectedQuantities] = useState({});
    
    const navigate = useNavigate();
    const { user, listarProdutos, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    const handleQuantitySelect = (productId, quantity) => {
        setSelectedQuantities(prev => ({
            ...prev,
            [productId]: quantity
        }));
    };

    const getProductPoints = (product, quantity) => {
        const pointsKey = `pontos_qtd_${quantity}`;
        return product[pointsKey] || product.pontos_qtd_1 || 0;
    };
    
    // Função de carregamento dos produtos
    const fetchProducts = async () => {
        if (!user?.idparticipante) {
            setError('Usuário não identificado');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const response = await listarProdutos(user.idparticipante);
            
            if (response.success && response.data) {
                // A API retorna os produtos em response.data
                const produtos = response.data;
                setProducts(produtos);
            } else {
                setError(response.message || 'Erro ao carregar produtos');
            }
                } catch (error) {
          console.error("Erro ao buscar produtos:", error);
          setError('Erro de comunicação. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Busca inicial
    useEffect(() => {
        fetchProducts();
    }, [user?.idparticipante]);

    // Componente de Loading
    const LoadingSpinner = () => (
        <div className="loading-message flex justify-center items-center py-12">
            <div style={{
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #ea4ea1',
                borderRadius: '50%',
                width: 32,
                height: 32,
                animation: 'spin 1s linear infinite'
            }} />
            <span className="ml-3 text-gray-600">Carregando produtos...</span>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );

    // Componente de Erro
    const ErrorMessage = () => (
        <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
                onClick={fetchProducts}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
                Tentar novamente
            </button>
        </div>
    );

    if (loading) {
        return (
            <PageContainer title="Quero resgatar" onLogout={handleLogout}>
                <LoadingSpinner />
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer title="Quero resgatar" onLogout={handleLogout}>
                <ErrorMessage />
            </PageContainer>
        );
    }

    return (
        <>
            <PageContainer title="Quero resgatar" onLogout={handleLogout}>
                <div className="container-resgatar-produtos">
                    {products.map((product, index) => {
                        const productId = product.idproduto || index;
                        const selectedQuantity = selectedQuantities[productId] || 1;
                        const currentPoints = getProductPoints(product, selectedQuantity);
                        
                        return (
                            <div className="card-regastar" key={productId}>
                                <div className="product-image">
                                    <img src={product.caminhofoto} alt={product.nomeproduto} />
                                </div>
                                <div className="product-info">
                                    <h2 className="quero-resgatar-points">{currentPoints} pts</h2>
                                    <h2 className="quero-resgatar-produtos">{product.nomeproduto}</h2>
                                    <p className="quero-resgatar-descricao">{product.descricaoproduto}</p>
                                    
                                    {/* Botões de quantidade */}
                                    <div className="quantity-selector">
                                        <h3>Escolha a quantidade:</h3>
                                        <div className="quantity-buttons">
                                                                                    <button 
                                            className={`quantity-btn ${selectedQuantity === 1 ? 'active' : ''}`}
                                            onClick={() => handleQuantitySelect(productId, 1)}
                                        >
                                            1 unid.
                                        </button>
                                        <button 
                                            className={`quantity-btn ${selectedQuantity === 2 ? 'active' : ''}`}
                                            onClick={() => handleQuantitySelect(productId, 2)}
                                        >
                                            2 unid.
                                        </button>
                                        <button 
                                            className={`quantity-btn ${selectedQuantity === 3 ? 'active' : ''}`}
                                            onClick={() => handleQuantitySelect(productId, 3)}
                                        >
                                            3 unid.
                                        </button>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    id="quero-resgatar-button" 
                                    onClick={() => navigate(`/produto/${product.nomeproduto}?qty=${selectedQuantity}`)}
                                >
                                    Quero Resgatar
                                </button>
                            </div>
                        );
                    })}
                </div>

                {products.length === 0 && !loading && !error && (
                    <p style={{ textAlign: 'center' }} className='loading-text'>Nenhum produto disponível no momento.</p>
                )}
            </PageContainer>

        </>
    );
};

export default ProductListPage; 