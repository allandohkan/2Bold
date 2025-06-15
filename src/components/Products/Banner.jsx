import React from 'react';
import BannerImage from '../../assets/images/Banner.png';
import '../../styles/Banner.scss';

const Banner = () => {
  return (
    <div className="bem-especial-products-table-banner">
      <img 
        src={BannerImage}
        alt="Banner Bem Especial - Programa de benefícios"
        className="bem-especial-products-table-banner-image"
      />
    </div>
  );
};

export default Banner;