/* Pages */
import React, { useState } from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import AboutUs from './components/AboutUs/AboutUs';
import Products from './components/Products/Products';
import Contacts from './components/Contacts/Contacts';

/* CSS */
import './components/Header/Header.css';
import './components/Footer/Footer.css';
import './components/Home/Home.css';
import './components/AboutUs/AboutUs.css';
import './components/Products/Products.css';
import './components/Contacts/Contacts.css';
import './styles/global.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
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
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;