import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';

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
`;

export const BannerTwo = styled.div`
  color: #fff;
  display: flex;
  align-items: left;
  padding: 0 1rem;
  height: 30%;
  font-size: 13px;
  font-family: 'Pretendard-Bold';
`;

export const BannerThree = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 1rem;
  height: 100%;
  max-width: auto;
`;
