import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/* Pages */
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Products from './pages/MeusPontos';
import BemEspecialLogin from './pages/LoginPage';

import './styles/global.scss';
import './App.css';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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
            path="/about" 
            element={DEV_MODE ? <AboutUs /> : <PrivateRoute element={<AboutUs />} />} 
          />
          <Route 
            path="/my-points" 
            element={DEV_MODE ? <Products /> : <PrivateRoute element={<Products />} />} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
