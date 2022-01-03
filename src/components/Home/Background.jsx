import React from 'react';
import styled from 'styled-components';
import bgImg from '../../static/assets/backgroundImg.jpg';
import HomeIntro from './HomeIntro/HomeIntro';
import HomeCityList from './HomeIntro/HomeCityList';

const BackgroundContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  @media (max-width: 768px) {
    height: 70vh;
  }

  & img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const Background = () => {
  return (
    <BackgroundContainer>
      <img src={bgImg} alt="메인배경" />
      <HomeIntro />
      <HomeCityList />
    </BackgroundContainer>
  );
};

export default Background;
