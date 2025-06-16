import React, { useState, useEffect } from 'react';
import '../../styles/ProductsTable.scss';

const ProductsTable = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
        const data = await response.json();

        const detailedProducts = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            const details = await res.json();
            return {
              date: "00/00/00",
              habitat: details.species.name,
              name: details.name,
              weight: details.weight,
              experience: details.base_experience,
            };
          })
        );

        setProducts(detailedProducts);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProducts();
  }, []);

    return (
      <div class="points-table-container">
  <div class="balance-box">Seu saldo total: <strong>999.999 pts</strong></div>
  <table className='product-table'>
    <thead>
        <th>Troca</th>
        <th>Loja</th>
        <th>Produto</th>
        <th>Quantidade</th>
        <th>Pontos Conquistados</th>
    </thead>
    <tbody>
        {products.map((product, index) => (
            <tr key={index}>
                <td>{product.date}</td>
                <td>{product.habitat}</td>
                <td>{product.name}</td>
                <td>{product.weight}</td>
                <td>{product.experience}</td>
            </tr>
        ))}
    </tbody>
  </table>
  </div>
    );
}

export default ProductsTable;