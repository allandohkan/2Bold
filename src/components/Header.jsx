import React from 'react';

const Header = ({ currentPage, setCurrentPage }) => {
  return (
    <header>
      <div>
        <h1>2Bold</h1>
        <nav>
          <ul>
            <li>
              <button onClick={() => setCurrentPage('home')}>
                Home
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage('aboutus')}>
                Sobre Nós
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage('products')}>
                Produtos
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage('contacts')}>
                Contatos
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;