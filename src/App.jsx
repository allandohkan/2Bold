import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/* Pages */
import Header from './layouts/Header/Header';
import Footer from './layouts/Footer/Footer';
import Home from './pages/Home/Home';
import AboutUs from './pages/AboutUs/AboutUs';
import Products from './pages/Products/Products';
import BemEspecialLogin from './pages/Login/LoginPage';

/* CSS */
import './layouts/Header/Header.scss';
import './layouts/Footer/Footer.scss';
import './pages/Home/Home.scss';
import './pages/AboutUs/AboutUs.scss';
import './pages/Products/Products.scss';
import './styles/Banner.scss';
import './pages/Login/LoginPage.scss';
import './styles/global.scss';
import './App.css';

const App = () => {
  // MODO DESENVOLVIMENTO - mude para false quando quiser testar a autenticação
  const DEV_MODE = true;
  
  const [isAuthenticated, setIsAuthenticated] = useState(DEV_MODE);

  console.log('DEV_MODE:', DEV_MODE);
  console.log('isAuthenticated:', isAuthenticated);
  console.log('Deveria mostrar header/footer?', (DEV_MODE || isAuthenticated));

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

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" replace />;
  };

  return (
    <BrowserRouter>
      {/* Header sempre visível no modo dev, ou quando autenticado */}
      {(DEV_MODE || isAuthenticated) && (
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      )}

      <main className="main-content">
        <Routes>
          {/* Home sempre acessível */}
          <Route path="/" element={<Home />} />
          
          {/* Login */}
          <Route 
            path="/login" 
            element={
              isAuthenticated 
                ? <Navigate to="/" replace /> 
                : <BemEspecialLogin onLogin={handleLogin} />
            } 
          />
          
          {/* Rotas que no futuro serão privadas, mas no dev mode são públicas */}
          <Route 
            path="/about" 
            element={DEV_MODE ? <AboutUs /> : <PrivateRoute element={<AboutUs />} />} 
          />
          <Route 
            path="/products" 
            element={DEV_MODE ? <Products /> : <PrivateRoute element={<Products />} />} 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer sempre visível no modo dev, ou quando autenticado */}
      {(DEV_MODE || isAuthenticated) && <Footer />}
    </BrowserRouter>
  );
};

export default App;