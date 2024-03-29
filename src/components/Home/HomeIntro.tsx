import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HomeIntro: React.FC = () => {
  return (
    <HomeIntroContainer>
      <IntroWrap>
        <span>
          너의 <br />
          여행기록들을 <br />
          공유 해봐 !
        </span>
      </IntroWrap>
      <CityLink to={'/city/전체'}>지금 여행기록 보러가기</CityLink>
    </HomeIntroContainer>
  );
};

const HomeIntroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: auto;
  position: absolute;
  top: 50%;
  left: 10%;
`;

const IntroWrap = styled.div`
  width: 100%;
  margin-bottom: 30px;
  & span {
    width: 240px;
    font-weight: 600;
    font-size: 45px;
    line-height: 120%;
    color: white;
    text-shadow: 1px 0.5px 2px black;
    @media (max-width: 768px) {
      font-size: 36px;
      width: 150px;
    }

    @media (max-width: 500px) {
      font-size: 30px;
      width: 150px;
    }
  }
`;

const CityLink = styled(Link)`
  border: 1px solid white;
  padding: 10px 20px;
  font-size: 18px;
  border-radius: 20px;
  color: white;
  :hover {
    background: #e3f4ea;
    color: #16a085;
  }
  @media (max-width: 500px) {
    padding: 10px 20px;
    font-size: 16px;
  }
`;

export default HomeIntro;
