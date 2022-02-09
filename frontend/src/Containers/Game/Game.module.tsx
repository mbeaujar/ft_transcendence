import React, { KeyboardEvent, useRef } from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import clsx from  'clsx';
import classes from './Game.module.scss';
import styles from './Game.module.scss';


const apiAxios = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
  });



function Game(/*props:any*/) {

    const [user, setUser] = useState<any>(null);
    const [activeGame, setActiveGame] = useState<boolean>(false);
    const paddlex= useRef<number>(175);

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

        console.log("attaching listener")
        const keyListener = (e:any) => {
          console.log("increasing selection")
          let tmp = paddlex.current + 1
          paddlex.current = paddlex.current - 5;
        };
        document.addEventListener("keydown", keyListener) 
      }, []);

      
    var canvas : any = document.getElementById(styles.canvas);
    var x = 50;
    var y = 50;
    var dx = 2;
    var dy = 4;
    var ctx:any;
    var WIDTH:any;
    var HEIGHT:any;
    /*var paddlex:any;*/
    var paddleh:any;
    var paddlew:any;

    function init() 
    {
        ctx = canvas.getContext("2d");
        var style = window.getComputedStyle(canvas),
        WIDTH = style.getPropertyValue('width');
        HEIGHT = style.getPropertyValue('height');
        return setInterval(draw, 10); // Exécuter draw() toutes les 10 ms
    }

    function init_paddle() 
    {
        /*paddlex = 350 / 2;*/
        paddleh = 10;
        paddlew = 75;
        console.log("paddlex = " + paddlex)
    }


    function circle(x:any,y:any,r:any) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    }
    
    function rect(x:any,y:any,w:any,h:any) {
        ctx.beginPath();
        ctx.rect(x,y,w,h);
        ctx.closePath();
        ctx.fill();
    }
    
    function clear() {
        ctx.clearRect(0, 0, 800, 400);
    }

    var rightDown = false;
    var leftDown = false;

    const keyDownHandler = (event: React.KeyboardEvent<Element>, paddlex:any) => {
        if (event.code === "ArrowLeft") 
        {
            leftDown = true;
            /*setPaddlex(paddlex - 5);*/
            /*rect(paddlex, 400-paddleh, paddlew, paddleh);*/
        }
        
        if (event.code === "ArrowRight") 
        {
            rightDown = true;
            console.log(rightDown);
            /*rect(paddlex, 400-paddleh, paddlew, paddleh);*/
        }
    };


    const keyUpHandler = (event: React.KeyboardEvent<Element>) => {
        if (event.code === "ArrowLeft") 
        {
            leftDown = false;
        }

        if (event.code === "ArrowRight") 
        {
            rightDown = false;
        }
    };

    
    

    function draw() 
    {
        clear();
        circle(x, y, 10);

        // Déplacer la raquette selon si gauche ou droite est actuellement enfoncée

        
        console.log("paddlex3= " + paddlex.current);

        
        rect(paddlex.current, 400-paddleh, paddlew, paddleh);

        if (x + dx > 800 || x + dx < 0) // Dépassement à droite ou à gauche
        {
            dx = -dx;
        }

        if (y + dy < 0)
        {
            dy = -dy;
        }
        else if (y + dy > 400) 
        {
            if (x > paddlex.current && x < paddlex.current + paddlew)
            {
                // Si la balle rentre en collision avec la raquette, la balle rebondit
                dy = -dy;
            }
            else
            {
                // Sinon la balle revient au centre
                x = 800/2;
                y = 400/2;
            }
        }
       
        x += dx;
        y += dy;
    }


    const play:any = () =>
    {
        if (canvas != null && activeGame == false)
        {
            setActiveGame(true);
            init();
            init_paddle();
        }
    }



    

    
    return (
        <>
        {/*https://jill-jenn.net/conferences/cassebriques/move.html*/}

        <div className={clsx(classes.Game, ftShowGame(user))}>
            <canvas id={styles.canvas} width="800" height="400" onClick={()=>play()}></canvas>
        </div>


        <div className={clsx(classes.unauthorized, ftShowUnauthorized(user))}>
            <h1>You must log in to access this feature</h1>
        </div>

        </>
    );
}

export default Game;

{/*tabIndex={0} onKeyDown={(event)=>keyDownHandler(event, paddlex)} onKeyUp={(event)=>keyUpHandler(event)*/}