import React, { useEffect, useState } from 'react';
import axios from 'axios';
import clsx from  'clsx';

import classes from './Friends.module.scss';

function Friends()
{

    return (
        <div className={classes.Friends}>

        <form>
            <label>Search user<input type="text" name="name" /></label>
            <input type="submit" value="Add Friends" />
        </form>
        
        </div>
    );

}

export default Friends;
