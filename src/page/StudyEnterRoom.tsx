/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from 'hooks/BaseUrl';
import Webcam from 'react-webcam';
import logo from '../assets/logo.svg';
import { Nav, NavLink, NavBtn, NavBtnLink, FormBtnLink } from './css/Navbar';
import {
  Round,
  RoundTwo,
  RoundCenter,
  RoundText,
  FlexStudyRoom,
  FlexDiv,
  FlexMyDiv,
} from './css/BannerElement';

export default function StudyEnterRoom() {
  return (
    <div>
      <Nav>
        <NavLink to="/">
          <img src={logo} alt="logo" />
        </NavLink>
      </Nav>
      <RoundTwo>
        <Webcam />
        <form style={{ marginLeft: '20px', justifyContent: 'center' }}>
          <div className="form-group">
            <label />
            <input
              type="name"
              className="form-control w-60"
              placeholder="Enter UserName"
            />
          </div>
          <NavBtn>
            <FormBtnLink to="/StudyRoom">입장</FormBtnLink>
          </NavBtn>
        </form>
      </RoundTwo>
    </div>
  );
}
