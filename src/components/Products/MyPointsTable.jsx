import React, { useState, useEffect } from 'react';

const MyPointsTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Estado para acordeons abertos no mobile
  const [openAccordions, setOpenAccordions] = useState([]);

  const toggleAccordion = (index) => {
    setOpenAccordions((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    const fetchMyPoints = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchMyPoints();
  }, []);

  // Componente de Loading
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      <span className="ml-3 text-gray-600">Carregando dados...</span>
    </div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="points-table-container">
      <div className="balance-box mb-4">Seu saldo total: <strong>999.999 pts</strong></div>
      {/* Tabela tradicional no desktop */}
      <div className="table-div overflow-x-auto">
        <table className="product-table hidden md:table min-w-full" cellSpacing={0} cellPadding={0}>
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

        {/* Acordeon para mobile */}
        <div className="points-acordion-container flex flex-col gap-2 md:hidden">
          {currentItems.map((product, index) => (
            <div key={index} className="border rounded-lg bg-white">
              <button
                className="acordion w-full flex items-center justify-between p-4 font-semibold focus:outline-none"
                onClick={() => toggleAccordion(index)}
                aria-expanded={!!openAccordions[index]}
                aria-controls={`accordion-content-${index}`}
              >
                <span className="text-left flex-1">Produto: {product.name}</span>
                <span className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{product.date}</span>
                  <svg className={`w-4 h-4 ml-2 transition-transform ${openAccordions[index] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
              </button>
              {openAccordions[index] && (
                <ul id={`accordion-content-${index}`} className="px-4 pb-4 text-sm animate-fade-in">
                  <li><span className="font-semibold">Loja:</span> {product.habitat}</li>
                  <li><span className="font-semibold">Quantidade:</span> {product.weight}</li>
                  <li><span className="font-semibold">Pontos Conquistados:</span> {product.experience}</li>
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="pagination flex flex-wrap gap-2 mt-4">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-2 py-1 border rounded disabled:opacity-50">
            {'<'}
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-2 py-1 border rounded ${currentPage === i + 1 ? 'bg-purple-200 font-bold' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">
            {'>'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyPointsTable;