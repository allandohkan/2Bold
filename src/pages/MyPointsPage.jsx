import ProductsTable from '../components/Products/MyPointsTable.jsx';
import PageContainer from '../layouts/Containers/DefaultPageContainer.jsx';

const MyPointsPage = () => {
  return (
    <PageContainer title="Meus Pontos">
      <ProductsTable />
    </PageContainer>
  );
};

export default MyPointsPage; 