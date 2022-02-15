import React, { useEffect, useState } from 'react';
import axios from 'axios';
import clsx from  'clsx';

import classes from './Chat.module.scss';


const apiAxios = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
  });

function Chat(/*props:any*/) {
    const [user, setUser] = useState<any>(null);

    function ftShowChat(user:any)
    {
        if (user==null)
        {
            return (classes.hideChat);
        }
        return (classes.showChat);
    }

    function ftShowUnauthorized(user:any)
    {
        if (user==null)
        {
            return (classes.showUnauthorized);
        }
        return (classes.hideUnauthorized);
    }

    useEffect(() => {
        apiAxios.get('/auth/status', 
        { withCredentials: true }).then(response => {setUser(response.data);}).catch(() => setUser(null));
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