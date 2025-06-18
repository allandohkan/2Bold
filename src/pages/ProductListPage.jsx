import React, { useState, useEffect, useRef } from 'react';
import PageContainer from '../layouts/Containers/DefaultPageContainer.jsx';
import { useNavigate } from 'react-router-dom';

const gerarLorem = () => {
    const textos = [
        "Lorem ipsum dolor sit amet.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.",
        "Este produto oferece desempenho superior com design inovador.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.",
    ];
    return textos[Math.floor(Math.random() * textos.length)];
};

const ITEMS_PER_PAGE = 15;

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const bottomRef = useRef();

    const navigate = useNavigate();
    
    // Função de carregamento
    const fetchProducts = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${ITEMS_PER_PAGE}&offset=${offset}`);
            const data = await response.json();

            const detailedProducts = await Promise.all(
                data.results.map(async (pokemon) => {
                    const res = await fetch(pokemon.url);
                    const details = await res.json();
                    return {
                        name: details.name,
                        image: details.sprites.front_default,
                        points: details.weight * 10,
                        description: gerarLorem(),
                    };
                })
            );

            setProducts((prev) => [...prev, ...detailedProducts]);
            setHasMore(data.next !== null);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    };

    // Busca inicial
    useEffect(() => {
        fetchProducts();
    }, []);

    // Observador de scroll infinito
    useEffect(() => {
        if (!bottomRef.current || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const isVisible = entries[0].isIntersecting;
                if (isVisible && !loading && hasMore) {
                    setOffset((prev) => prev + ITEMS_PER_PAGE);
                }
            },
            { threshold: 1.0 }
        );

        observer.observe(bottomRef.current);
        return () => observer.disconnect();
    }, [bottomRef.current, loading, hasMore]);

    useEffect(() => {
        if (offset !== 0) fetchProducts();
    }, [offset]);

    // Componente de Loading
    const LoadingSpinner = () => (
        <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">Carregando produtos...</span>
        </div>
    );

    if (initialLoading) {
        return (
            <PageContainer title="Quero resgatar">
                <LoadingSpinner />
            </PageContainer>
        );
    }

    return (
        <PageContainer title="Quero resgatar">
            <div className="container-resgatar-produtos">
                {products.map((product, index) => (
                    <div className="card-regastar" key={index}>
                        <div className="product-image">
                            <img src={product.image} alt={product.name} />
                        </div>
                        <div className="product-info">
                            <h2 className="quero-resgatar-points">{product.points} pts</h2>
                            <h2 className="quero-resgatar-produtos">{product.name}</h2>
                            <p className="quero-resgatar-descricao">{product.description}</p>
                        </div>
                        <button id="quero-resgatar-button" onClick={() => navigate(`/produto/${product.name}`)}>Quero Resgatar</button>
                    </div>
                ))}
            </div>

            {/* Referencia para o IntersectionObserver */}
            <div ref={bottomRef} style={{ height: 1 }} />

            {loading && <p style={{ textAlign: 'center' }} className='loading-text'>Carregando mais produtos...</p>}
            {!hasMore && <p style={{ textAlign: 'center' }} className='loading-text'>Todos os produtos foram carregados.</p>}
        </PageContainer>
    );
};

export default ProductListPage; 