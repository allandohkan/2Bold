import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import logoIcon from '../../assets/icons/logo.png';

const Header = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  return (
    <header className="bem-especial-header">
      <div className="header-container">
        <div className="header-content">
          <div className="logo-section">
            <Link to="/" >
              <img src={logoIcon} alt="Bem Especial" className="logo-icon" />
            </Link>
          </div>

          {/* MOBILE: Nome e pontos */}
          <div className="mobile-user-info">
            <div className="points-display">
            <div className="greeting-text">Olá, Rafael</div>
              <div className="points-label">VOCÊ TEM</div>
              <div className="points-value">999.999 pts</div>
            </div>
            <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          {/* DESKTOP: Navegação e user-section */}
          <nav className="main-nav">
            <Link to="/meus-pontos" className={`nav-button ${isActive('/meus-pontos') ? 'active' : ''}`}>Meus Pontos</Link>
            <Link to="/resgatar" className={`nav-button ${isActive('/resgatar') ? 'active' : ''}`}>Quero Resgatar</Link>
            <Link to="/vouchers" className={`nav-button ${isActive('/vouchers') ? 'active' : ''}`}>Meus Vouchers</Link>
          </nav>
          <div className="user-section">
            <div className="user-greeting">
              <div className="greeting-text">Olá, Rafael</div>
            </div>
            <div className="points-display">
              <div className="points-label">VOCÊ TEM</div>
              <div className="points-value">999.999 pts</div>
            </div>
            <button className="exit-button" onClick={handleLogout}>Sair</button>
          </div>

          {/* MOBILE DRAWER */}
          <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
            <button className="close-drawer" onClick={() => setMenuOpen(false)} aria-label="Fechar menu">×</button>
            <nav className="drawer-nav">
              <Link to="/meus-pontos" className={`nav-button ${isActive('/meus-pontos') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Meus Pontos</Link>
              <Link to="/resgatar" className={`nav-button ${isActive('/resgatar') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Quero Resgatar</Link>
              <Link to="/vouchers" className={`nav-button ${isActive('/vouchers') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Meus Vouchers</Link>
              <button className="exit-button" onClick={() => { setMenuOpen(false); handleLogout(); }}>Sair</button>
            </nav>
          </div>
          {/* Overlay para fechar drawer ao clicar fora */}
          {menuOpen && <div className="drawer-overlay" onClick={() => setMenuOpen(false)}></div>}
        </div>
      </div>
    </header>
  );
};

export default Header;