import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from 'page/Home';
import StudyRoom from 'page/StudyRoom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/studyRoom/:roomUuid" element={<StudyRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
