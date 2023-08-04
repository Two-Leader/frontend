import { Button } from 'react-bootstrap';
import { NavLink as Link } from 'react-router-dom';
import { text } from 'stream/consumers';
import styled from 'styled-components';

export const User = styled.div`
  postiion: relative;
  margin-top: 20px;
  margin-left: 50px;
  border-radius: 20px;
  background: #fff;
  padding: 10px 20px;
  height: 250px;
  width: 20vw;
  box-shadow: 2px 2px 3px 1px rgba(0, 0, 0, 0.2);
`;

export const Room = styled.div`
  postiion: relative;
  margin-top: 35px;
  margin-left: 50px;
  border-radius: 20px;
  background: #fff;
  padding: 10px 20px;
  height: 50vh;
  width: 20vw;
  box-shadow: 2px 2px 3px 1px rgba(0, 0, 0, 0.2);
`;

export const Footer = styled.footer`
  background: #181d23;
  height: 6vh;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0.5rem calc((100vw - 1300px) / 2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

export const FooterBtn = styled.footer`
  display: flex;
  align-items: center;
  margin-right: 24px;
  /* Third Nav */
  /* justify-content: flex-end;
  width: 100vw; */

  @media screen and (max-width: 768px) {
    display: none;
  }
`;
export const FooterBtnLink = styled(Link)`
  border-radius: 20px;
  background: #3b71ca;
  padding: 5px 20px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  font-size: 16px;
  font-family: 'Pretendard-Medium';

  /* Second Nav */
  margin-left: 10px;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: #204c95;
    color: #fff;
  }
`;
export const ScreenBtnLink = styled(Link)`
  border-radius: 20px;
  background: #3b71ca;
  padding: 5px 10px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  font-size: 16px;
  font-family: 'Pretendard-Medium';

  /* Second Nav */
  margin-left: 10px;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: #204c95;
    color: #fff;
  }
`;
export const ExitBtnLink = styled(Link)`
  border-radius: 20px;
  background: #d10202;
  padding: 5px 20px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  font-size: 16px;
  font-family: 'Pretendard-Medium';
  text-align: center;
  margin-left: 80%;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: #ac0000;
    color: #fff;
  }
`;
export const WebcamContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 49%);
  gap: 10px;
  margin-left: 8%;
  margin-top: 13px;
`;
