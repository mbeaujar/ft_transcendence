import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Game from './Containers/Game/Game.module';
import Chat from './Containers/Chat/Chat.module';
import Profile from './Containers/Profile/Profile.module';
import Header from './Containers/Header/Header.module';

function App() {
  return (
    <div className="App Layout">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/Game" element={<Game />} />
          <Route path="/Chat" element={<Chat />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
