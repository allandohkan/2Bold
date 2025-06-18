import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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

const DEV_MODE = false; // Mudando para false para testar autenticação

const PrivateRoute = ({ element }) => {
  // TODO: Implementar lógica de autenticação
  return element;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(DEV_MODE);

  const handleLogin = (cpf, password) => {
    const validCredentials = [
      { cpf: '448.552.608-94', password: 'admin' },
      { cpf: '111.111.111-11', password: '123456' },
      { cpf: '123.456.789-00', password: 'senha123' }
    ];

    const isValid = validCredentials.some(
      cred => cred.cpf === cpf && cred.password === password
    );

    if (isValid) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home onLogout={handleLogout} />} />
          <Route 
            path="/login" 
            element={
              isAuthenticated 
                ? <Navigate to="/" replace /> 
                : <BemEspecialLogin onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/meus-pontos" 
            element={DEV_MODE ? <MyPointsPage /> : <PrivateRoute element={<MyPointsPage />} />} 
          />
          <Route 
            path="/vouchers" 
            element={DEV_MODE ? <VouchersPage /> : <PrivateRoute element={<VouchersPage />} />} 
          />
          <Route path="/produto/:nome" element={<SingleProduct />} />
          <Route 
            path="/resgatar" 
            element={DEV_MODE ? <ProductListPage /> : <PrivateRoute element={<ProductListPage />} />} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
