import React, { useEffect, useState } from 'react';
import clsx from  'clsx';

import classes from './Friends.module.scss';

function Friends()
{

    return (
        <div className={classes.Friends}>

            <div className={classes.addFriends}>
                <p>Search User</p>
                <form></form>
                <button>Send friend request</button>
            </div>
        
        </div>
    );

}

export default Friends;
