import React, { useState, useEffect } from 'react';
import PageContainer from '../layouts/Containers/DefaultPageContainer.jsx';

const ResgatePage = () => {

    const [products, setProducts] = useState([]);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=15');
                const data = await response.json();

                const detailedProducts = await Promise.all(
                    data.results.map(async (pokemon) => {
                        const res = await fetch(pokemon.url);
                        const details = await res.json();
                        return {
                            name: details.name,
                            image: details.sprites.front_default,
                            points: details.weight * 10,
                            description: `Experiência base: ${details.base_experience}`,
                        };
                    })
                );

                setProducts(detailedProducts);
            } catch (error) {
                console.error("Erro ao buscar produtos: ", error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <PageContainer title="Resgate">
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
                        <button id="quero-resgatar-button">Quero Resgatar</button>
                    </div>
                ))}
            </div>
        </PageContainer>
    );
};

export default ResgatePage;