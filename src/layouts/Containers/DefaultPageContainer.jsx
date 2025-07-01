import React from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Banner from '../../components/Banner.jsx';
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
