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
        <div className="table-div overflow-x-auto">
          {/* Tabela tradicional no desktop */}
          <table className='vouchers-table min-w-full divide-y divide-gray-200 text-sm text-left hidden md:table' cellSpacing={0} cellPadding={0}>
            <thead className="">
              <tr>
                <th className="px-4 py-2 whitespace-nowrap">Data do Resgate</th>
                <th className="px-4 py-2 whitespace-nowrap">Loja</th>
                <th className="px-4 py-2 whitespace-nowrap">Produto</th>
                <th className="px-4 py-2 whitespace-nowrap">Pontos Utilizados</th>
                <th className="px-4 py-2 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentItems.map((voucher, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 whitespace-nowrap">{voucher.date}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{voucher.store}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{voucher.product}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{voucher.points}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{voucher.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Acordeon para mobile */}
          <div className="points-acordion-container flex flex-col gap-2 md:hidden">
            {currentItems.map((voucher, index) => (
              <VouchersAccordionItem
                key={index}
                voucher={voucher}
                index={index}
              />
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
    </DefaultPageContainer>
  );
};

// Componente de acordeon para mobile
function VouchersAccordionItem({ voucher, index }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border rounded-lg bg-white">
      <button
        className="acordion w-full flex items-center justify-between p-4 font-semibold focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={`accordion-content-${index}`}
      >
        <span className="text-left flex-1">Produto: {voucher.product}</span>
        <span className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{voucher.date}</span>
          <svg className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </span>
      </button>
      {open && (
        <ul id={`accordion-content-${index}`} className="px-4 pb-4 text-sm animate-fade-in">
          <li><span className="font-semibold">Loja:</span> {voucher.store}</li>
          <li><span className="font-semibold">Pontos Utilizados:</span> {voucher.points}</li>
          <li><span className="font-semibold">Status:</span> {voucher.status}</li>
        </ul>
      )}
    </div>
  );
}

export default VouchersPage; 