import React, { useState, useEffect } from 'react';
import DefaultPageContainer from '../layouts/Containers/DefaultPageContainer';
import '../styles/pages/_vouchers.scss';

const VouchersPage = () => {
  const [vouchers, setVouchers] = useState([]);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = vouchers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(vouchers.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
        const data = await response.json();

        const detailedVouchers = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            const details = await res.json();
            return {
              date: "01/01/2024",
              store: details.species.name,
              product: details.name,
              points: details.base_experience,
              status: "Resgatado"
            };
          })
        );

        setVouchers(detailedVouchers);
      } catch (error) {
        console.error("Erro ao buscar vouchers:", error);
      }
    };

    fetchVouchers();
  }, []);

  return (
    <DefaultPageContainer title="Meus Vouchers">
      <div className="vouchers-table-container">
        <div className="table-div">
          <table className='vouchers-table'>
            <thead>
              <tr>
                <th>Data do Resgate</th>
                <th>Loja</th>
                <th>Produto</th>
                <th>Pontos Utilizados</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((voucher, index) => (
                <tr key={index}>
                  <td>{voucher.date}</td>
                  <td>{voucher.store}</td>
                  <td>{voucher.product}</td>
                  <td>{voucher.points}</td>
                  <td>{voucher.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              {'<'}
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={currentPage === i + 1 ? 'active' : ''}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              {'>'}
            </button>
          </div>
        </div>
      </div>
    </DefaultPageContainer>
  );
};

export default VouchersPage; 