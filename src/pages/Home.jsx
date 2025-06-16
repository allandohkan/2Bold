import Carousel from '../components/Carousel';
import Footer from '../layouts/Footer/Footer';
import Header from '../layouts/Header/Header';
import CarouselImage from '../../src/assets/images/mainbanner.png'

const Home = () => {
  return (
    <div>
      <Header />
      <Carousel>
        <div><img src={CarouselImage}
          alt="Banner Bem Especial - Programa de benefícios"
          className="carousel-image" /></div>
          <div><img src={CarouselImage}
          alt="Banner Bem Especial - Programa de benefícios"
          className="carousel-image" /></div>
      </Carousel>
      <main className=" page-content">
        <div className="home-buttons">
          <div className="card">
            <div className="icon">
              <img src="../../../src/assets/images/meuspontos.png" alt="" />
            </div>
            <div className="text">
              <p>Confira seu extrato de pontos</p>
            </div>
            <a href="" className="action-button">
              Meus Pontos
            </a>
          </div>
          <div className="card">
            <div className="icon">
              <img src="../../../src/assets/images/produtosdisponiveis.png" alt="" />
            </div>
            <div className="text">
              <p>Veja os produtos disponíveis</p>
            </div>
            <a href="" className="action-button">
              Quero Resgatar
            </a>
          </div>
          <div className="card">
            <div className="icon">
              <img src="../../../src/assets/images/resgates.png" alt="" />
            </div>
            <div className="text">
              <p>Acompanhe os resgates dos seus Vouchers</p>
            </div>
            <a href="" className="action-button">
              Meus Vouchers
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;