/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from 'hooks/BaseUrl';
import logo from '../assets/logo.svg';
import { Nav, NavLink, NavBtn, NavBtnLink, FormBtnLink } from './css/Navbar';
import { User, Room } from './css/Footer';

export default function StudyRoom() {
  return (
    <div>
      <Nav>
        <NavLink to="/">
          <img src={logo} alt="logo" />
        </NavLink>
      </Nav>
      <User />
      <Room />
    </div>
  );
}
