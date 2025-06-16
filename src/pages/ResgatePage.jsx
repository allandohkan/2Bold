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
        {products.map((product, index) => (
        <div className="container-resgatar-produtos">
            <div className="card-regastar">
                <div className="product-image">
                    <img src={product.image} alt="{product.name}"/>
                    <h2 className="Quero-resgatar-points">{product.points} pts</h2>
                    <h2 className="Quero-resgatar-produtos">{product.name}</h2>
                    <h3 className="Quero-resgatar-descricao">{product.description}</h3>
                </div>
            </div>
            <button id="quero-resgatar-button">Quero Resgatar</button>
        </div>
    ))}
      </PageContainer>
  );
};

export default ResgatePage;