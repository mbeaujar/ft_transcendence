import React, { useEffect, useState } from 'react';
import axios from 'axios';
import clsx from  'clsx';
import classes from './Game.module.scss';
import './Game.module.scss'


const apiAxios = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
  });

function Game(/*props:any*/) {
    const [user, setUser] = useState<any>(null);

    function ftShowGame(user:any)
    {
        if (user==null)
        {
            return (classes.hideGame);
        }
        return (classes.showGame);
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
        {/*https://www.youtube.com/watch?v=PeY6lXPrPaA*/}

        <div className={clsx(classes.Game, ftShowGame(user))}>
            <div className={classes.score}>
                <div className={classes.player_score}>0</div>
                <div className={classes.computer_score}>0</div>
            </div>
            <div className={classes.ball} id="ball"></div>
            <div className={clsx(classes.paddle, classes.left, classes.player_paddle)}></div>
            <div className={clsx(classes.paddle, classes.right, classes.computer_paddle)}></div>
        </div>


        <div className={clsx(classes.unauthorized, ftShowUnauthorized(user))}>
            <h1>You must log in to access this feature</h1>
        </div>

        </>
    );
}

export default Game;