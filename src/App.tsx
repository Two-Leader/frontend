import React from 'react';
import { BrowserRouter, Route, Routes, RouteProps } from 'react-router-dom';
import './App.css';
import Home from 'page/Home';
import Login from 'component/LoginModal';
import Signup from 'component/SignUpModal';
import StudyRoom from 'page/StudyRoom';
import UserInfo from 'page/UserInfo';
// import HeaderItem from 'component/HeaderItem';

function App() {
  return (
    <BrowserRouter>
      {/* <HeaderItem /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route
          path="/signup"
          Component={Signup as React.ComponentType<RouteProps>}
        />
        <Route
          path="/login"
          Component={Login as React.ComponentType<RouteProps>}
        /> */}
        <Route path="/studyRooms/:roomUuid/users" element={<UserInfo />} />
        <Route path="/studyRooms/:roomUuid" element={<StudyRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
