import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/* Pages */
import Home from './pages/Home';
import ResgatePage from './pages/ResgatePage';
import Products from './pages/MeusPontos';
import BemEspecialLogin from './pages/LoginPage';
import SingleProduct from './pages/SingleProduct';

import './styles/global.scss';
import './styles/main.scss';
import './App.css';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import VouchersPage from './pages/VouchersPage';

const App = () => {
  const DEV_MODE = true;
  const [isAuthenticated, setIsAuthenticated] = useState(DEV_MODE);

  const handleLogin = (cpf, password) => {
    const validCredentials = [
      { cpf: '000.000.000-00', password: 'admin' },
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

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" replace />;
  };

  return (
    <BrowserRouter>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
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
            element={DEV_MODE ? <Products /> : <PrivateRoute element={<Products />} />} 
          />
          <Route 
            path="/vouchers" 
            element={DEV_MODE ? <VouchersPage /> : <PrivateRoute element={<VouchersPage />} />} 
          />
          <Route path="/produto/:nome" element={<SingleProduct />} />
          <Route 
            path="/resgatar" 
            element={DEV_MODE ? <ResgatePage /> : <PrivateRoute element={<ResgatePage />} />} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
