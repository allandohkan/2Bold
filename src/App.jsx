/* Pages */
import React, { useState } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import AboutUs from './components/AboutUs/AboutUs';
import Products from './components/Products/Products';
import Contacts from './components/Contacts/Contacts';
import BemEspecialLogin from './components/Login/LoginPage';

/* CSS */
import './components/Header/Header.css';
import './components/Footer/Footer.css';
import './components/Home/Home.css';
import './components/AboutUs/AboutUs.css';
import './components/Products/Products.css';
import './components/Contacts/Contacts.css';
import './components/Login/LoginPage.css';
import './styles/global.css';
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  
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
      setShowLogin(false);
      setCurrentPage('home');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('home');
    setShowLogin(true);
  };

  const handleShowLogin = () => {
    setShowLogin(true);
  };

  const handleBackFromLogin = () => {
    setShowLogin(false);
  };

  const renderPage = () => {
    if (showLogin) {
      return (
        <BemEspecialLogin 
          onLogin={handleLogin}
          onBack={handleBackFromLogin}
        />
      );
    }

    switch(currentPage) {
      case 'home':
        return <Home />;
      case 'aboutus':
        return <AboutUs />;
      case 'products':
        return <Products />;
      case 'contacts':
        return <Contacts />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="app">
      {!showLogin && (
        <Header 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          isAuthenticated={isAuthenticated}
          onLogin={handleShowLogin}
          onLogout={handleLogout}
        />
      )}
      <main className="main-content">
        {renderPage()}
      </main>
      {!showLogin && <Footer />}
    </div>
  );
};

export default App;