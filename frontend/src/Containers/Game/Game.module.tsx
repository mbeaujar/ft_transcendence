import React, { useEffect, useState } from 'react';
import axios from 'axios';
import clsx from  'clsx';
import classes from './Game.module.scss';
import styles from './Game.module.scss'


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

      
    var canvas : any = document.getElementById(styles.canvas);
/*
        var ctx : any = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(75, 75, 10, 0, Math.PI*2, true); // Centre (75, 75), rayon 10, de 0 à 2π
        ctx.closePath();
        ctx.fill();*/

        var x = 50;
        var y = 50;
        var dx = 0.2;
        var dy = 0.4;
        var ctx:any;

    function init() {
        ctx = canvas.getContext("2d");
        return setInterval(draw, 100); // Exécuter draw() toutes les 10 ms
    }

    function draw() {
    ctx.clearRect(0,0,300,300);
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
    x += dx; // On déplace la balle
    y += dy;
    }

    if (canvas != null)
    {
        init();
    }

    
    






    
    return (
        <>
        {/*https://www.youtube.com/watch?v=PeY6lXPrPaA*/}

        <div className={clsx(classes.Game, ftShowGame(user))}>
            <canvas id={styles.canvas}></canvas>
        </div>


        <div className={clsx(classes.unauthorized, ftShowUnauthorized(user))}>
            <h1>You must log in to access this feature</h1>
        </div>

        </>
    );
}

export default Game;