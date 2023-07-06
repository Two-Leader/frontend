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
