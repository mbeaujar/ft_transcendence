import React, { useEffect, useState } from 'react';
import api from '../apis/api';
import clsx from 'clsx';

import classes from './Chat.module.scss';

function Chat(/*props:any*/) {
  const [user, setUser] = useState<any>(null);

  function ftShowChat(user: any) {
    if (user == null) {
      return classes.hideChat;
    }
    return classes.showChat;
  }

  function ftShowUnauthorized(user: any) {
    if (user == null) {
      return classes.showUnauthorized;
    }
    return classes.hideUnauthorized;
  }

  useEffect(() => {
    api
      .get('/auth/status')
      .then(response => {
        setUser(response.data);
      })
      .catch(() => setUser(null));
  }, []);

  return (
    <>
      <div className={clsx(classes.Chat, ftShowChat(user))}>
        <h1>Chat</h1>
      </div>
      <div className={clsx(classes.unauthorized, ftShowUnauthorized(user))}>
        <h1>You must log in to access this feature</h1>
      </div>
    </>
  );
}

export default Chat;
