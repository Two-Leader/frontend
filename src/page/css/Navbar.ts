import { Button } from 'react-bootstrap';
import { NavLink as Link } from 'react-router-dom';
import { text } from 'stream/consumers';
import styled from 'styled-components';

export const Nav = styled.nav`
  background: #fff;
  height: 50px;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem calc((100vw - 1300px) / 2);
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  /* Third Nav */
  /* justify-content: flex-start; */
`;

export const NavLink = styled(Link)`
  color: #fff;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
`;

export const NavBtn = styled.nav`
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
export const FormBtnLink = styled(Link)`
  border-radius: 20px;
  background: #3b71ca;
  padding: 10px 20px;
  margin-top: 20px;
  color: #fff;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  font-size: 16px;
  font-family: 'Pretendard-Medium';
  width: 450px;
  text-align: center;

  /* Second Nav */
  margin-left: 10px;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: #204c95;
    color: #fff;
  }
`;
export const NavBtnLink = styled(Link)`
  border-radius: 20px;
  background: #3b71ca;
  padding: 10px 20px;
  color: #fff;
  outline: none;
  border: none;
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
export const Btn = styled(Link)`
  font-size: 16px;
  cursor: pointer;
  margin-top: 1px;
  padding: 3px;
  color: #3b71ca;
  text-decoration-line: none;
  font-family: 'Pretendard-Bold';
`;
export const BtnSpan = styled.span`
  font-size: 16px;
  color: #000;
  text-decoration-line: none;
  font-family: 'Pretendard-Medium';
`;
export const BtnDiv = styled.div`
  text-align: center;
  width: 100%;
`;
