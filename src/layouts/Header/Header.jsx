import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Header.scss';
import logoIcon from '../../assets/icons/logo.png';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bem-especial-header">
      <div className="header-container">
        <div className="header-content">
          <div className="logo-section">
            <img src={logoIcon} alt="Bem Especial" className="logo-icon" />
          </div>

          <nav className="main-nav hidden md:flex">
            <Link to="/pontos" 
              className={`nav-button nav-button-primary ${isActive('/pontos') ? 'active' : ''}`}
            >
              Meus Pontos
            </Link>
            
            <Link to="/resgatar"
              className={`nav-button nav-button-secondary ${isActive ('/resgatar') ? 'active' : ''}`}
            >
              Quero Resgatar
            </Link>
            
            <Link to="/vouchers"
              className={`nav-button nav-button-secondary ${isActive ('/vouchers') ? 'active' : ''}`}
            >
              Meus Vouchers
            </Link>
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