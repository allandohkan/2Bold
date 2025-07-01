import React, { useState, useEffect } from 'react';
import DefaultPageContainer from '../layouts/Containers/DefaultPageContainer';
import { useAuth } from '../contexts/AuthContext';
import usePagination from '../hooks/usePagination';
import Pagination from '../components/Pagination';

const VouchersPage = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, meusVouchers } = useAuth();

  // Paginação usando hook personalizado
  const {
    currentItems,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    goToPage
  } = usePagination(vouchers, 10);

  const handlePageChange = (page) => {
    goToPage(page);
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
    <div className="loading-message flex justify-center items-center py-12">
      <div style={{
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #ea4ea1',
        borderRadius: '50%',
        width: 32,
        height: 32,
        animation: 'spin 1s linear infinite'
      }} />
      <span className="ml-3 text-gray-600 mt-5 mb-5">Carregando vouchers...</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
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
    <DefaultPageContainer title="Meus Vouchers" onLogout={handleLogout}>
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
            
            {totalItems === 0 && !loading && !error && (
              <div className="text-center py-12 table-message">
                <p className="text-gray-500">Nenhum voucher encontrado.</p>
              </div>
            )}
            
            {totalItems > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
              />
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