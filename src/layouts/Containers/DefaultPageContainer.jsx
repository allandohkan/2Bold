import React from 'react';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import Banner from '../../components/Products/Banner.jsx';
import PageTitle from '../../components/PageTitle.jsx';

const DefaultPageContainer = ({ title, children }) => {
  return (
    <div>
      <Header />
      <Banner />
      <PageTitle title={title} />
      <main className="page-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DefaultPageContainer;
