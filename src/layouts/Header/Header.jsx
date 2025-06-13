import React from 'react';
import './Header.scss';
import logoIcon from '../../assets/icons/logo.png';

const Header = ({ currentPage, setCurrentPage }) => {
  return (
    <header className="bem-especial-header">
      <div className="header-container">
        <div className="header-content">
          <div className="logo-section">
            <img src={logoIcon} alt="Bem Especial" className="logo-icon" />
          </div>

          <nav className="main-nav hidden md:flex">
            <button 
              onClick={() => setCurrentPage('pontos')}
              className={`nav-button nav-button-primary ${currentPage === 'pontos' ? 'active' : ''}`}
            >
              Meus Pontos
            </button>
            
            <button 
              onClick={() => setCurrentPage('resgatar')}
              className={`nav-button nav-button-secondary ${currentPage === 'resgatar' ? 'active' : ''}`}
            >
              Quero Resgatar
            </button>
            
            <button 
              onClick={() => setCurrentPage('vouchers')}
              className={`nav-button nav-button-secondary ${currentPage === 'vouchers' ? 'active' : ''}`}
            >
              Meus Vouchers
            </button>
          </nav>

          <div className="user-section">
            <div className="user-greeting">
              <div className="greeting-text">Olá, Rafael</div>
            </div>

            <div className="points-display">
              <div className="points-label">VOCÊ TEM</div>
              <div className="points-value">999.999 pts</div>
            </div>

            <button className="exit-button" onClick={() => console.log('Sair clicado')}>
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;