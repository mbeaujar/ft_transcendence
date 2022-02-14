import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Auth from './auth/Auth';
import Chat from './chat/Chat';
import Header from './Header';
import File from './file/File';
import { IUser } from './interface/user.interface';

const App: React.FC = (): JSX.Element => {
  const [user, setUser] = useState<IUser>();

  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Auth user={user} setUser={setUser} />} />
          {user ? <Route path="/chat" element={<Chat user={user} />} /> : null}
          {user ? <Route path="/file" element={<File user={user} />} /> : null}
        </Routes>
      </BrowserRouter>
      <br />
    </div>
  );
};

export default App;
