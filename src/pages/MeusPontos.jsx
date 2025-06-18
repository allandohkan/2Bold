import ProductsTable from '../components/Products/ProductsTable.jsx';
import PageContainer from '../layouts/Containers/DefaultPageContainer.jsx';

const MeusPontos = () => {

  return (
      <PageContainer title="Meus Pontos">
        <ProductsTable />
      </PageContainer>
  );
};

export default MeusPontos;