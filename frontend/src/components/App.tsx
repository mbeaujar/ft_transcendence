import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Auth from './auth/Auth';
import Chat from './chat/Chat';
import Header from './Header';
import File from './file/File';
import { IUser } from './interface/user.interface';
// import Game from './game/Game';
import api from '../apis/api';
import Pong from './game/Pong';

const App: React.FC = (): JSX.Element => {
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    api
      .get('/auth/status')
      .then(response => setUser(response.data))
      .catch(reject => console.log('user not found', reject));
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          ^
          <Route path="/" element={<Auth user={user} />} />
          {/* {user ? <Route path="/chat" element={<Chat user={user} />} /> : null} */}
          {/* {user ? <Route path="/file" element={<File user={user} />} /> : null} */}
          {/* {user ? <Route path="/game" element={<Game />} /> : null} */}
          {user ? <Route path="/game" element={<Pong user={user} />} /> : null}
        </Routes>
      </BrowserRouter>
      <br />
    </div>
  );
};

export default App;
