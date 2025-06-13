import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/* Pages */
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import AboutUs from './components/AboutUs/AboutUs';
import Products from './components/Products/Products';
import ProductsTable from './components/Products/ProductsTable';
import BemEspecialLogin from './components/Login/LoginPage';

/* CSS */
import './components/Header/Header.css';
import './components/Footer/Footer.css';
import './components/Home/Home.css';
import './components/AboutUs/AboutUs.css';
import './components/Products/Products.css';
import './components/Products/ProductsTable.css';
import './components/Login/LoginPage.css';
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