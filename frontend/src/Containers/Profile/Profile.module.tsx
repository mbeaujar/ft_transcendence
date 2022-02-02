import React, { useEffect, useState } from 'react';
import axios from 'axios';
import clsx from  'clsx';

import classes from './Profile.module.scss';

const apiAxios = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
  });

function Profile(/*props:any*/) {
    const [user, setUser] = useState<any>(null);

    function ftShowProfile(user:any)
    {
        if (user==null)
        {
            return (classes.hideProfile);
        }
        return (classes.showProfile);
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
      });

    return (
        <>

        <div className={clsx(classes.Profile, ftShowProfile(user))}>
            <div className={classes.User}>
                <img src={user?.avatar}/>
                <h1>{user?.username}</h1>    
            </div>
        </div>




        <div className={clsx(classes.unauthorized, ftShowUnauthorized(user))}>
            <h1>You must log in to access this feature</h1>
        </div>

        </>
    );
}
export default Profile;