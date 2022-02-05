import React, { useState } from 'react';
import Auth from './auth/Auth';
import Chat from './chat/Chat';
import { IUser } from './interface/user.interface';

const App: React.FC = (): JSX.Element => {
  const [user, setUser] = useState<IUser>();

  return (
    <div>
      <Auth user={user} setUser={setUser} />
      <br />
      {user ? <Chat user={user} /> : null}
    </div>
  );
};

export default App;
