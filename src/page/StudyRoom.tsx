/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from 'hooks/BaseUrl';
import Webcam from 'react-webcam';
import logo from '../assets/logo.svg';
import { Nav, NavLink } from './css/Navbar';
import {
  User,
  Room,
  Footer,
  FooterBtn,
  FooterBtnLink,
  ScreenBtnLink,
  WebcamContainer,
  ExitBtnLink,
} from './css/Footer';
import mic from '../assets/mic.svg';
import video from '../assets/video.svg';
import screen from '../assets/screen.svg';

export default function StudyRoom() {
  return (
    <div>
      <Nav>
        <NavLink to="/">
          <img src={logo} alt="logo" />
        </NavLink>
      </Nav>
      {/* User와 Room을 감싸는 컨테이너 */}
      <div style={{ display: 'flex' }}>
        <div style={{ flexDirection: 'column' }}>
          <User />
          <Room />
        </div>
        <WebcamContainer>
          {/* Webcam을 감싸는 컨테이너 */}
          <Webcam style={{ width: '450px', height: '350px' }} />
          <Webcam style={{ width: '450px', height: '350px' }} />
          <Webcam style={{ width: '450px', height: '350px' }} />
          <Webcam style={{ width: '450px', height: '350px' }} />
        </WebcamContainer>
      </div>

      <Footer>
        <FooterBtn>
          <FooterBtnLink to="/">
            <img src={video} alt="video" />
          </FooterBtnLink>
          <FooterBtnLink to="/">
            <img src={mic} alt="mic" />
          </FooterBtnLink>
          <ScreenBtnLink to="/">
            <img src={screen} alt="screen" />
          </ScreenBtnLink>
          <ExitBtnLink to="/">EXIT</ExitBtnLink>
        </FooterBtn>
      </Footer>
    </div>
  );
}
