import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";



import Layout from './Containers/Layout/Layout.module';
import Game from './Containers/Game/Game.module';
import Chat from './Containers/Chat/Chat.module';
import Profile from './Containers/Profile/Profile.module';



function App() {
  return (
    <div className="App">
      <Layout>
        <Router>
          <Routes>
            <Route path="/" element={<Game/>} />
            <Route path="/Game" element={<Game/>} />
            <Route path="/Chat" element={<Chat/>} />
            <Route path="/Profile" element={<Profile/>} />
          </Routes>
        </Router>
      </Layout>
    </div>
  );
}

export default App;
