import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from 'page/Home';
import StudyRoom from 'page/StudyRoom';
import UserInfo from 'page/UserInfo';
import HeaderItem from 'component/HeaderItem';

function App() {
  return (
    <BrowserRouter>
      <HeaderItem />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/studyRooms/:roomUuid/users" element={<UserInfo />} />
        <Route path="/studyRooms/:roomUuid" element={<StudyRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
