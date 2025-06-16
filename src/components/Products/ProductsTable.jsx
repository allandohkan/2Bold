import React, { useState, useEffect } from 'react';
import '../../styles/ProductsTable.scss';

const ProductsTable = () => {
  const [products, setProducts] = useState([]);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

const totalPages = Math.ceil(products.length / itemsPerPage);

const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages) {
    setCurrentPage(page);
  }
};

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
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
      <div className="points-table-container">
  <div className="balance-box">Seu saldo total: <strong>999.999 pts</strong></div>
  <table className='product-table'>
    <thead>
      <tr>
        <th>Troca</th>
        <th>Loja</th>
        <th>Produto</th>
        <th>Quantidade</th>
        <th>Pontos Conquistados</th>
        </tr>
    </thead>
    <tbody>
        {currentItems.map((product, index) => (
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
  <div className="pagination">
  {/*<button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
    Anterior
  </button>*/}
  {Array.from({ length: totalPages }, (_, i) => (
    <button
      key={i + 1}
      onClick={() => handlePageChange(i + 1)}
      className={currentPage === i + 1 ? 'active' : ''}
    >
      {i + 1}
    </button>
  ))}
  {/*<button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
    Próximo
  </button>*/}
</div>

  </div>
    );
}

export default ProductsTable;