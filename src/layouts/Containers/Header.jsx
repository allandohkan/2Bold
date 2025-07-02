import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import logoIcon from '../../assets/icons/logo.png';

const Header = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [loadingPoints, setLoadingPoints] = useState(false);
  const hasFetchedPoints = useRef(false);
  const lastFetchedUserId = useRef(null);
  const isExecuting = useRef(false);
  
  const { user, meusPontos, consultarSaldo, currentStep, user: authUser, forceRefreshPoints } = useAuth();

  const isActive = (path) => location.pathname === path;

  // Resetar loading quando não há usuário
  useEffect(() => {
    if (!user?.idparticipante) {
      setLoadingPoints(false);
      setUserPoints(0);
      hasFetchedPoints.current = false; // Resetar ref quando usuário muda
      lastFetchedUserId.current = null; // Resetar ID do último usuário
      isExecuting.current = false; // Resetar flag de execução
    }
  }, [user?.idparticipante]);

  // Buscar pontos do usuário quando o componente carregar
  useEffect(() => {
    // Só executar se o usuário estiver autenticado e currentStep for "authenticated"
    if (!user?.idparticipante || currentStep !== 'authenticated') {
      setLoadingPoints(false);
      hasFetchedPoints.current = false; // Resetar ref
      lastFetchedUserId.current = null; // Resetar ID
      isExecuting.current = false; // Resetar flag de execução
      return;
    }

    // Verificar se já buscamos pontos para este usuário específico
    if (hasFetchedPoints.current && lastFetchedUserId.current === user.idparticipante) {
      return;
    }

    // Verificar se já está executando
    if (isExecuting.current) {
      return;
    }

    // Marcar como já buscado IMEDIATAMENTE para evitar chamadas duplicadas
    hasFetchedPoints.current = true;
    lastFetchedUserId.current = user.idparticipante;
    isExecuting.current = true;

    const fetchUserPoints = async () => {
      // Verificar se ainda deve executar
      if (!isExecuting.current) {
        return;
      }

      setLoadingPoints(true);
      
      try {
        const result = await consultarSaldo(user.idparticipante);
        
        // Verificar se ainda deve processar o resultado
        if (!isExecuting.current) {
          return;
        }
        
        if (result.success) {
          const pontos = result.data.saldo;
          setUserPoints(pontos);
        } else {
          setUserPoints('0');
        }
      } catch (error) {
        setUserPoints('0');
      } finally {
        // Só atualizar loading se ainda estiver executando
        if (isExecuting.current) {
          setLoadingPoints(false);
          isExecuting.current = false;
        }
      }
    };

    // Buscar pontos imediatamente
    fetchUserPoints();
  }, [user?.idparticipante, currentStep]); // Removido meusPontos das dependências

  // Listener para atualizações de pontos via evento customizado
  useEffect(() => {
    const handlePointsUpdate = () => {
      if (user?.idparticipante && currentStep === 'authenticated') {
        // Resetar flags para permitir nova busca
        isExecuting.current = false;
        hasFetchedPoints.current = false;
        lastFetchedUserId.current = null;
        
        // Buscar pontos atualizados
        const fetchUpdatedPoints = async () => {
          setLoadingPoints(true);
          try {
            const result = await consultarSaldo(user.idparticipante);
            if (result.success) {
              const pontos = result.data.saldo;
              setUserPoints(pontos);
            }
          } catch (error) {
            console.error('Erro ao atualizar pontos no header:', error);
          } finally {
            setLoadingPoints(false);
          }
        };
        
        fetchUpdatedPoints();
      }
    };

    // Escutar evento de atualização de pontos
    window.addEventListener('pointsUpdated', handlePointsUpdate);

    return () => {
      window.removeEventListener('pointsUpdated', handlePointsUpdate);
    };
  }, [user?.idparticipante, currentStep, consultarSaldo]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login', { replace: true });
  };

  // Função para forçar refresh dos pontos (opcional)
  const handleRefreshPoints = async () => {
    if (user?.idparticipante) {
      // Resetar flags para permitir nova busca
      isExecuting.current = false;
      hasFetchedPoints.current = false;
      lastFetchedUserId.current = null;
      
      setLoadingPoints(true);
      
      try {
        const result = await consultarSaldo(user.idparticipante);
        
        if (result.success) {
          const pontos = result.data.saldo;
          setUserPoints(pontos);
        }
      } catch (error) {
        // Erro silencioso
      } finally {
        setLoadingPoints(false);
      }
    }
  };

  // NOTA: Para adicionar um botão de refresh manual, você pode usar:
  // <button onClick={handleRefreshPoints} disabled={loadingPoints}>
  //   {loadingPoints ? 'Atualizando...' : '🔄'}
  // </button>

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
                {loadingPoints ? 'Carregando...' : userPoints ? `${formatPoints(userPoints)} pts` : '0 pts'}
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
                {loadingPoints ? 'Carregando...' : userPoints ? `${formatPoints(userPoints)} pts` : '0 pts'}
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