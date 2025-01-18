import React from 'react';
import './HomePage.css';
import HomeHeader from '../components/Home/HomeHeader';
import useUserRedirect from '../components/Shared/useUserRedirect';
import HomeBanner from '../components/Home/HomeBanner';

const HomePage = (props) => {
  const isValidUser = useUserRedirect(props.token);
  if (!isValidUser) {
    return null;
  }

  const handlePlay = () => {
    console.log("Play button clicked!");
  };

  const handleMoreInfo = () => {
    console.log("More Info button clicked!");
  };

  return (
    <div className='home-page'>
      <HomeHeader
        username='John Doe'
        profilePicture='default-picture.png'
      />

      <HomeBanner
        title='Featured Movie'
        description='An exciting movie description goes here!'
        imageUrl='banner.jpg'
        onPlay={handlePlay}
        onMoreInfo={handleMoreInfo}
      />

      <h1>Home</h1>
    </div>
  );
};


export default HomePage;
