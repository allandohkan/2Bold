import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Wrapper personalizado para slides com melhor acessibilidade
const SlideWrapper = ({ children, ...props }) => (
  <div 
    {...props}
    tabIndex={-1}
    role="group"
    aria-label="Slide do carrossel"
  >
    {children}
  </div>
);

const Carousel = ({ children }) => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1, 
    slidesToScroll: 1,
    // Configurações para acessibilidade
    accessibility: true,
    focusOnSelect: false,
    swipeToSlide: true,
    touchMove: true,
    // Remover tabindex dos slides
    useCSS: true,
    useTransform: true,
    // Configurações adicionais para acessibilidade
    adaptiveHeight: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <div className="carousel-container" role="region" aria-label="Carrossel de banners">
      <Slider {...settings}>
        {React.Children.map(children, (child, index) => (
          <SlideWrapper key={index}>
            {child}
          </SlideWrapper>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;