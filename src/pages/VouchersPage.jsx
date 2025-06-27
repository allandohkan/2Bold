import React, { useState, useEffect } from 'react';
import DefaultPageContainer from '../layouts/Containers/DefaultPageContainer';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/_vouchers.scss';

const VouchersPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { user, meusVouchers } = useAuth();

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
      if (!user?.idparticipante) {
        setError('Usuário não identificado');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const response = await meusVouchers(user.idparticipante);
        
        if (response.success && response.data) {
          // A API retorna os vouchers em response.data.resgates
          const resgates = response.data.resgates || [];
          setVouchers(resgates);
        } else {
          setError(response.message || 'Erro ao carregar vouchers');
        }
      } catch (error) {
        console.error("Erro ao buscar vouchers:", error);
        setError('Erro de comunicação. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [user?.idparticipante, meusVouchers]);

  // Componente de Loading
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      <span className="ml-3 text-gray-600 mt-5 mb-5">Carregando vouchers...</span>
    </div>
  );

  // Componente de Erro
  const ErrorMessage = () => (
    <div className="text-center py-12">
      <p className="text-red-600 mb-4">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Tentar Novamente
      </button>
    </div>
  );

  return (
    <DefaultPageContainer title="Meus Vouchers">
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage />
      ) : (
        <div className="vouchers-table-container">
          <div className="table-div overflow-x-auto">
            {/* Tabela tradicional no desktop */}
            <table className='vouchers-table min-w-full divide-y divide-gray-200 text-sm text-left hidden md:table' cellSpacing={0} cellPadding={0}>
              <thead>
                <tr>
                  <th className="px-4 py-2 whitespace-nowrap">Data do Resgate</th>
                  <th className="px-4 py-2 whitespace-nowrap">Data de Utilização</th>
                  <th className="px-4 py-2 whitespace-nowrap">Loja</th>
                  <th className="px-4 py-2 whitespace-nowrap">Produto</th>
                  <th className="px-4 py-2 whitespace-nowrap">Quantidade</th>
                  <th className="px-4 py-2 whitespace-nowrap">Pontos</th>
                  <th className="px-4 py-2 whitespace-nowrap">Vigência</th>
                  <th className="px-4 py-2 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {currentItems.map((voucher, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap align-middle">{voucher.dataresgate}</td>
                    <td className="px-4 py-2 whitespace-nowrap align-middle">{voucher.datautilzacao || '-'}</td>
                    <td className="px-4 py-2 whitespace-nowrap align-middle">{voucher.loja || '-'}</td>
                    <td className="px-4 py-2 whitespace-nowrap align-middle">{voucher.produto}</td>
                    <td className="px-4 py-2 whitespace-nowrap align-middle">{voucher.qtde}</td>
                    <td className="px-4 py-2 whitespace-nowrap align-middle">{voucher.pontos}</td>
                    <td className="px-4 py-2 align-middle">
                      <div className="vigencia-info">
                        <div className="vigencia-line">{voucher.dataviginicio}</div>
                        <div className="vigencia-line">até</div>
                        <div className="vigencia-line">{voucher.datavigfim}</div>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap align-middle">
                      <span className={`status-badge ${voucher.status === 'Utilizado' ? 'used' : 'issued'}`}>
                        {voucher.status}
                      </span>
                    </td>
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
            
            {vouchers.length === 0 && !loading && !error && (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhum voucher encontrado.</p>
              </div>
            )}
            
            {vouchers.length > 0 && (
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
            )}
          </div>
        </div>
      )}


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
        <span className="text-left flex-1">Produto: {voucher.produto}</span>
        <span className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{voucher.dataresgate}</span>
          <span className={`status-badge ${voucher.status === 'Utilizado' ? 'used' : 'issued'}`}>
            {voucher.status}
          </span>
          <svg className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </span>
      </button>
      {open && (
        <ul id={`accordion-content-${index}`} className="px-4 pb-4 text-sm animate-fade-in">
          <li><span className="font-semibold">Data de Utilização:</span> {voucher.datautilzacao || '-'}</li>
          <li><span className="font-semibold">Loja:</span> {voucher.loja || '-'}</li>
          <li><span className="font-semibold">Quantidade:</span> {voucher.qtde}</li>
          <li><span className="font-semibold">Pontos:</span> {voucher.pontos}</li>
          <li><span className="font-semibold">Vigência:</span> {voucher.dataviginicio} até {voucher.datavigfim}</li>
        </ul>
      )}
    </div>
  );
}

export default VouchersPage; 