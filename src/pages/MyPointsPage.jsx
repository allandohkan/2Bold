import MyPointsTable from '../components/MyPointsTable.jsx';
import PageContainer from '../layouts/Containers/DefaultPageContainer.jsx';

const MyPointsPage = () => {
  return (
    <PageContainer title="Meus Pontos">
      <MyPointsTable />
    </PageContainer>
  );
};

export default MyPointsPage; 