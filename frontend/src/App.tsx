import React, { useEffect, useState } from 'react';
import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Game from './Containers/Game/Game.module';
import Chat from './Containers/Chat/Chat.module';
import Profile from './Containers/Profile/Profile.module';
import Header from './Containers/Header/Header.module';
import { IUser } from './Containers/Profile/interface/user.interface';
import api from './Containers/apis/api';

const App: React.FC = (): JSX.Element => {
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    api
      .get('/auth/status')
      .then(response => setUser(response.data))
      .catch(reject => console.error(reject));
  }, []);

  return (
    <div className="App Layout">
      <Router>
        <Header />
        {user ? (
          <Routes>
            <Route path="/" element={<Game />} />
            <Route path="/Game" element={<Game />} />
            <Route path="/Chat" element={<Chat />} />
            <Route path="/Profile" element={<Profile user={user} />} />
          </Routes>
        ) : (
          <h1 className="unauthorized">
            You must log in to access this feature
          </h1>
        )}
      </Router>
    </div>
  );
};

export default App;
