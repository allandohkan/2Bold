import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';

const MyPointsTable = () => {
  const { user } = useAuth();
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saldo, setSaldo] = useState(0);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = points.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(points.length / itemsPerPage);

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
      if (!user?.idparticipante) {
        setError('Usuário não identificado');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const response = await apiService.meusPontos(user.idparticipante);
        
        if (response.success && response.data) {
          // A API retorna os pontos em response.data.transacoes
          const transacoes = response.data.transacoes || [];
          setPoints(transacoes);
          setSaldo(response.data.saldo || 0);
        } else {
          setError(response.message || 'Erro ao carregar pontos');
        }
      } catch (error) {
        console.error("Erro ao buscar pontos:", error);
        setError('Erro de comunicação. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPoints();
  }, [user?.idparticipante]);

  // Componente de Loading
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      <span className="ml-3 text-gray-600">Carregando dados...</span>
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  return (
    <div className="points-table-container">
      <div className="balance-box mb-4">Seu saldo total: <strong>{saldo} pts</strong></div>
      {/* Tabela tradicional no desktop */}
      <div className="table-div overflow-x-auto">
        <table className="product-table hidden md:table min-w-full" cellSpacing={0} cellPadding={0}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Loja</th>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Pontos Conquistados</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((point, index) => (
              <tr key={index}>
                <td>{point.datacompra}</td>
                <td>{point.loja_nome || '-'}</td>
                <td>{point.produto_nome}</td>
                <td>{point.tr_qtde_produto}</td>
                <td>{point.tr_pontos}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Acordeon para mobile */}
        <div className="points-acordion-container flex flex-col gap-2 md:hidden">
          {currentItems.map((point, index) => (
            <div key={index} className="border rounded-lg bg-white">
              <button
                className="acordion w-full flex items-center justify-between p-4 font-semibold focus:outline-none"
                onClick={() => toggleAccordion(index)}
                aria-expanded={!!openAccordions[index]}
                aria-controls={`accordion-content-${index}`}
              >
                <span className="text-left flex-1">Produto: {point.produto_nome}</span>
                <span className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{point.datacompra}</span>
                  <svg className={`w-4 h-4 ml-2 transition-transform ${openAccordions[index] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
              </button>
              {openAccordions[index] && (
                <ul id={`accordion-content-${index}`} className="px-4 pb-4 text-sm animate-fade-in">
                  <li><span className="font-semibold">Loja:</span> {point.loja_nome || '-'}</li>
                  <li><span className="font-semibold">Quantidade:</span> {point.tr_qtde_produto}</li>
                  <li><span className="font-semibold">Pontos Conquistados:</span> {point.tr_pontos}</li>
                </ul>
              )}
            </div>
          ))}
        </div>
        
        {points.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum ponto encontrado.</p>
          </div>
        )}
        
        {points.length > 0 && (
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
  );
}

export default MyPointsTable;