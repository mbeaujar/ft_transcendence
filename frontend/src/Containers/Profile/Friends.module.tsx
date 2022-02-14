import React, { useEffect, useState } from 'react';
import axios from 'axios';
import clsx from  'clsx';

import classes from './Friends.module.scss';

function Friends()
{
    const [title, setTitle] = useState('');

    return (
        <div className={classes.Friends}>

            <div className={classes.FriendsLeft}>
                <h2>My Friends</h2>
            </div>

            
            <div className={classes.FriendsRight}>
                <div className={classes.AddFriends}>
                    <h2>Add new friends</h2>
                    <form>
                        <label>Search user</label>
                        <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}/>
                        <button>Add friends</button>
                    </form>
                </div>

                <div className={classes.FriendsRequest}>
                    <h2>Friends Request</h2>
                </div>
            </div>

        
        </div>
    );

}

export default Friends;
