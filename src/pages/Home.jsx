import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';
import Footer from '../layouts/Footer/Footer';
import Header from '../layouts/Header/Header';

import CarouselImage from '../assets/images/mainbanner.png';
import MeusPontosImage from '../assets/images/meuspontos.png';
import ProdutosDisponiveisImage from '../assets/images/produtosdisponiveis.png';
import ResgatesImage from '../assets/images/resgates.png';

const Home = ({ onLogout }) => {
  return (
    <div>
      <Header onLogout={onLogout} />
      <Carousel>
        <div>
          <img src={CarouselImage} alt="Banner Bem Especial - Programa de benefícios" className="carousel-image" />
        </div>
        <div>
          <img src={CarouselImage} alt="Banner Bem Especial - Programa de benefícios" className="carousel-image" />
        </div>
      </Carousel>
      <main className="page-content">
        <div className="home-buttons">
          <div className="card">
            <div className="icon">
              <img src={MeusPontosImage} alt="Meus Pontos" />
            </div>
            <div className="text">
              <p>Confira seu extrato de pontos</p>
            </div>
            <Link to="/meus-pontos" className="action-button">Meus Pontos</Link>
          </div>
          <div className="card">
            <div className="icon">
              <img src={ProdutosDisponiveisImage} alt="Produtos Disponíveis" />
            </div>
            <div className="text">
              <p>Veja os produtos disponíveis</p>
            </div>
            <Link to="/resgatar" className="action-button">Quero Resgatar</Link>
          </div>
          <div className="card">
            <div className="icon">
              <img src={ResgatesImage} alt="Resgates" />
            </div>
            <div className="text">
              <p>Acompanhe os resgates dos seus Vouchers</p>
            </div>
            <Link to="/vouchers" className="action-button">Meus Vouchers</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
