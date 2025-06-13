import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/* Pages */
import Header from './layouts/Header/Header';
import Footer from './layouts/Footer/Footer';
import Home from './pages/Home/Home';
import AboutUs from './pages/AboutUs/AboutUs';
import Products from './pages/Products/Products';
import ProductsTable from './pages/Products/ProductsTable';
import BemEspecialLogin from './pages/Login/LoginPage';

/* CSS */
import './layouts/Header/Header.css';
import './layouts/Footer/Footer.css';
import './pages/Home/Home.css';
import './pages/AboutUs/AboutUs.css';
import './pages/Products/Products.css';
import './pages/Products/ProductsTable.css';
import './pages/Login/LoginPage.css';
import './styles/global.css';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    return isAuthenticated ? element : <Navigate to="/" replace />;
  };

  return (
    <BrowserRouter>
      {isAuthenticated && <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />}

      <main className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated 
                ? <Navigate to="/home" replace /> 
                : <BemEspecialLogin onLogin={handleLogin} />
            } 
            
          />
          <Route path="/home" element={<PrivateRoute element={<Home />} />} />
          <Route path="/about" element={<PrivateRoute element={<AboutUs />} />} />
          <Route path="/products" element={<PrivateRoute element={<Products />} />} />
          <Route path="/products-table" element={<PrivateRoute element={<ProductsTable />} />} />
          
          <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/"} replace />} />
        </Routes>
      </main>

      {isAuthenticated && <Footer />}
    </BrowserRouter>
  );
};

export default App;