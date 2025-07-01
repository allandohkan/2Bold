import MyPointsTable from '../components/MyPointsTable.jsx';
import PageContainer from '../layouts/Containers/DefaultPageContainer.jsx';
import { useAuth } from '../contexts/AuthContext';

const MyPointsPage = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <PageContainer title="Meus Pontos" onLogout={handleLogout}>
      <MyPointsTable />
    </PageContainer>
  );
};

export default MyPointsPage; 