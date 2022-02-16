import React, { useEffect, useState } from 'react';
import api from '../apis/api';
import clsx from 'clsx';

import classes from './Chat.module.scss';

function Chat(/*props:any*/) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api
      .get('/auth/status')
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => setUser(null));
  }, []);

  return (
    <>
      <div className={clsx(classes.Chat)}>
        <h1>Chat</h1>
      </div>
    </>
  );
}

export default Chat;
