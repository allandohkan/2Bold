import React, { useState, useEffect } from 'react';
import PageContainer from '../layouts/Containers/DefaultPageContainer.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();
    const { user, listarProdutos } = useAuth();
    
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
        <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">Carregando produtos...</span>
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
            <PageContainer title="Quero resgatar">
                <LoadingSpinner />
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer title="Quero resgatar">
                <ErrorMessage />
            </PageContainer>
        );
    }

    return (
        <PageContainer title="Quero resgatar">
            <div className="container-resgatar-produtos">
                {products.map((product, index) => (
                    <div className="card-regastar" key={product.idproduto || index}>
                        <div className="product-image">
                            <img src={product.caminhofoto} alt={product.nomeproduto} />
                        </div>
                        <div className="product-info">
                            <h2 className="quero-resgatar-points">{product.pontos_qtd_1} pts</h2>
                            <h2 className="quero-resgatar-produtos">{product.nomeproduto}</h2>
                            <p className="quero-resgatar-descricao">{product.descricaoproduto}</p>
                        </div>
                        <button id="quero-resgatar-button" onClick={() => navigate(`/produto/${product.nomeproduto}`)}>Quero Resgatar</button>
                    </div>
                ))}
            </div>

            {products.length === 0 && !loading && !error && (
                <p style={{ textAlign: 'center' }} className='loading-text'>Nenhum produto disponível no momento.</p>
            )}
        </PageContainer>
    );
};

export default ProductListPage; 