import ProductsTable from '../../components/Products/ProductsTable.jsx';
import PageContainer from '../../layouts/Containers/DefaultPageContainer.jsx';

const Products = () => {

  return (
      <PageContainer title="Produtos">
        <ProductsTable />
      </PageContainer>
  );
};

export default Products;