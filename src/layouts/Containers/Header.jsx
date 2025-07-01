import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import logoIcon from '../../assets/icons/logo.png';

const Header = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [loadingPoints, setLoadingPoints] = useState(true);
  
  const { user, meusPontos } = useAuth();

  const isActive = (path) => location.pathname === path;

  // Buscar pontos do usuário quando o componente carregar
  useEffect(() => {
    const fetchUserPoints = async () => {
      if (user?.idparticipante) {
        setLoadingPoints(true);
        try {
          const response = await meusPontos(user.idparticipante);
          if (response.success && response.data) {
            // A API retorna o saldo em response.data.saldo
            const points = response.data.saldo || 0;
            setUserPoints(points);
          }
        } catch (error) {
          console.error('Erro ao buscar pontos:', error);
          setUserPoints(0);
        } finally {
          setLoadingPoints(false);
        }
      } else {
        setLoadingPoints(false);
      }
    };

    fetchUserPoints();
  }, [user?.idparticipante, meusPontos]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  // Formatar pontos com separador de milhares
  const formatPoints = (points) => {
    return points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Obter primeiro nome do usuário
  const getFirstName = (fullName) => {
    if (!fullName) return '';
    return fullName.split(' ')[0];
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
              <div className="greeting-text">Olá, {getFirstName(user?.nome)}</div>
              <div className="points-label">VOCÊ TEM</div>
              <div className="points-value">
                {loadingPoints ? 'Carregando...' : `${formatPoints(userPoints)} pts`}
              </div>
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
              <div className="greeting-text">Olá, {getFirstName(user?.nome)}</div>
            </div>
            <div className="points-display">
              <div className="points-label">VOCÊ TEM</div>
              <div className="points-value">
                {loadingPoints ? 'Carregando...' : `${formatPoints(userPoints)} pts`}
              </div>
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