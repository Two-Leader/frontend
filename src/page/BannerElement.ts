import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';
import studyroomImage from '../assets/studyroom.svg';

export const Banner = styled.div`
  background: #181d23;
  height: 300px;
  display: flex;
  flex-direction: column;
  padding: 0.5rem calc((100vw - 1300px) / 2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

export const BannerOne = styled.div`
  color: #fff;
  display: flex;
  align-items: left;
  padding: 0 1rem;
  height: 50%;
  font-size: 48px;
  font-family: 'Pretendard-Bold';
  margin-top: 80px;
`;

export const BannerTwo = styled.div`
  color: #fff;
  display: flex;
  align-items: left;
  padding: 0 1rem;
  height: 30%;
  font-size: 13px;
  font-family: 'Pretendard-Medium';
`;

export const BannerThree = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 1rem;
  height: 100%;
  max-width: auto;
  margin-top: -260px;
`;

export const Round = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  background: #fff;
  padding: 10px 20px;
  height: 200px;
  width: 80vw;
  box-shadow: 2px 2px 3px 1px rgba(0, 0, 0, 0.2);
`;

export const RoundCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const RoundText = styled.div`
  display: flex;
  justify-content: left;
  font-family: 'Pretendard-Bold';
  padding: 20px 20px 10px;
  margin-left: 7vw;
  font-size: 16px;
`;

export const FlexStudyRoom = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: row nowrap;
  position: 'relative';

  img {
    margin-right: 1rem;
  }
`;

export const FlexDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: row nowrap;
  margin-right: 1rem;
  width: 240px;
  height: 220px;
  background-image: url(${studyroomImage});
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 20px;
`;
