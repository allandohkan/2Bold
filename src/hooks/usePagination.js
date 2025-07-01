import { useState, useMemo } from 'react';

const usePagination = (items, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular dados de paginação
  const paginationData = useMemo(() => {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    return {
      currentItems,
      totalItems,
      totalPages,
      currentPage,
      itemsPerPage,
      indexOfFirstItem: indexOfFirstItem + 1,
      indexOfLastItem: Math.min(indexOfLastItem, totalItems)
    };
  }, [items, currentPage, itemsPerPage]);

  // Função para mudar de página
  const goToPage = (page) => {
    const validPage = Math.max(1, Math.min(page, paginationData.totalPages));
    setCurrentPage(validPage);
  };

  // Funções de navegação
  const goToNextPage = () => {
    if (currentPage < paginationData.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(paginationData.totalPages);
  };

  // Reset para primeira página quando os itens mudam
  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  return {
    ...paginationData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    resetToFirstPage
  };
};

export default usePagination; 