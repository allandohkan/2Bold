import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

/* Pages */
import Home from './pages/Home';
import BemEspecialLogin from './pages/LoginPage';
import SingleProduct from './pages/SingleProduct';
import ProductListPage from './pages/ProductListPage';
import MyPointsPage from './pages/MyPointsPage';
import VouchersPage from './pages/VouchersPage';

import './styles/global.scss';
import './styles/main.scss';
import './App.css';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const DEV_MODE = true; // Ativando temporariamente para permitir acesso sem autenticação

const PrivateRoute = ({ element }) => {
  const { user, currentStep, loading } = useAuth();
  
  console.log('PrivateRoute - user:', user);
  console.log('PrivateRoute - currentStep:', currentStep);
  console.log('PrivateRoute - loading:', loading);
  console.log('PrivateRoute - DEV_MODE:', DEV_MODE);
  
  // Se ainda está carregando, mostra loading
  if (loading) {
    console.log('PrivateRoute - Ainda carregando...');
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Carregando...</span>
      </div>
    );
  }
  
  // Se está no modo DEV ou se o usuário está autenticado
  if (DEV_MODE || (user && currentStep === 'authenticated')) {
    console.log('PrivateRoute - Acesso permitido');
    return element;
  }
  
  console.log('PrivateRoute - Redirecionando para login');
  return <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { user, currentStep, logout } = useAuth();
  const isAuthenticated = user && currentStep === 'authenticated';

  const handleLogout = () => {
    logout();
  };

  // Função para limpar localStorage (debug)
  const clearLocalStorage = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <main className="main-content">
      {/* Botão de debug temporário */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 9999 }}>
          <button 
            onClick={clearLocalStorage}
            style={{ 
              background: 'red', 
              color: 'white', 
              padding: '5px 10px', 
              border: 'none', 
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            Limpar Cache
          </button>
        </div>
      )}
      
      <Routes>
        <Route path="/" element={<Home onLogout={handleLogout} />} />
        <Route 
          path="/login" 
          element={
            isAuthenticated 
              ? <Navigate to="/" replace /> 
              : <BemEspecialLogin />
          } 
        />
        <Route 
          path="/meus-pontos" 
          element={<PrivateRoute element={<MyPointsPage />} />} 
        />
        <Route 
          path="/vouchers" 
          element={<PrivateRoute element={<VouchersPage />} />} 
        />
        <Route path="/produto/:nome" element={<SingleProduct />} />
        <Route 
          path="/resgatar" 
          element={<PrivateRoute element={<ProductListPage />} />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
