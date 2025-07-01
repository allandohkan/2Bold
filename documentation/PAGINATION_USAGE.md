## Componente Pagination (`src/components/Pagination.jsx`)

Componente visual que renderiza os controles de paginação.

### Props:
- `currentPage` (number): Página atual
- `totalPages` (number): Total de páginas
- `onPageChange` (function): Função chamada quando a página muda
- `itemsPerPage` (number): Itens por página
- `totalItems` (number): Total de itens
- `showItemsInfo` (boolean, opcional): Mostrar info "Mostrando X a Y de Z itens" (padrão: true)
- `className` (string, opcional): Classes CSS adicionais

### Exemplo básico:
```jsx
import Pagination from './components/Pagination';

const MyComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = 100;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      itemsPerPage={itemsPerPage}
      totalItems={totalItems}
    />
  );
};
```

### Parâmetros:
- `items` (array): Array de itens a serem paginados
- `itemsPerPage` (number, opcional): Itens por página (padrão: 10)

### Retorna:
- `currentItems`: Itens da página atual
- `currentPage`: Página atual
- `totalPages`: Total de páginas
- `totalItems`: Total de itens
- `itemsPerPage`: Itens por página
- `indexOfFirstItem`: Índice do primeiro item da página atual
- `indexOfLastItem`: Índice do último item da página atual
- `goToPage(page)`: Função para ir para uma página específica
- `goToNextPage()`: Função para próxima página
- `goToPreviousPage()`: Função para página anterior
- `goToFirstPage()`: Função para primeira página
- `goToLastPage()`: Função para última página
- `resetToFirstPage()`: Função para resetar para primeira página

### Exemplo com hook:
```jsx
import usePagination from './hooks/usePagination';
import Pagination from './components/Pagination';

const MyComponent = () => {
  const [data, setData] = useState([]);
  
  const {
    currentItems,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    goToPage
  } = usePagination(data, 10);

  return (
    <div>
      {/* Renderizar currentItems */}
      {currentItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
      
      {/* Componente de paginação */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
      />
    </div>
  );
};
```

### Uso em Outras Páginas:
Para usar em outras páginas, basta:
1. Importar o hook `usePagination`
2. Importar o componente `Pagination`
3. Aplicar a lógica conforme os exemplos acima

O sistema é totalmente independente e pode ser usado em qualquer lista de dados que precise de paginação. 