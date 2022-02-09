import React, { useRef } from 'react';
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
    /*const paddleY= useRef<number>(175);*/


    const stateGame = useRef<any>({
        arrowLeft:Boolean(false),
        arrowRight:Boolean(false),
        ballX:Number(0),
        ballY:Number(0),
        ballDx:Number(0),
        ballDy:Number(0),
        player1PaddleY:Number(0)
    });

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

    useEffect(() => 
    {
        apiAxios.get('/auth/status', 
        { withCredentials: true }).then(response => {setUser(response.data);}).catch(() => setUser(null));
    });

    var canvas : any = document.getElementById(styles.canvas);

    var ctx:any;
    var WIDTH:any;
    var HEIGHT:any;


    function init() 
    {
        ctx = canvas.getContext("2d");
        var style = window.getComputedStyle(canvas),
        WIDTH = style.getPropertyValue('width');
        HEIGHT = style.getPropertyValue('height');
        
        stateGame.current.ballX = 800/2;
        stateGame.current.ballY = 400/2;
        stateGame.current.ballDx = 4;
        stateGame.current.ballDy = 2;

        stateGame.current.player1PaddleY = 175/2;
        stateGame.current.player1PaddleW = 10;
        stateGame.current.player1PaddleH = 75;
        
        return setInterval(draw, 10); // Exécuter draw() toutes les 10 ms
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


    const keyDownHandler = (event: React.KeyboardEvent<Element>) => {
        if (event.code === "ArrowLeft") 
        {
            stateGame.current.arrowLeft = true;
        }
        
        if (event.code === "ArrowRight") 
        {
            stateGame.current.arrowRight = true;
        }
    };

    const keyUpHandler = (event: React.KeyboardEvent<Element>) => {
        if (event.code === "ArrowLeft") 
        {
            stateGame.current.arrowLeft = false;
        }
        
        if (event.code === "ArrowRight") 
        {
            stateGame.current.arrowRight = false;
        }
    };
    
    

    function draw() 
    {
        clear();
        ctx.fillStyle = "#FFFFFF";
        circle(stateGame.current.ballX, stateGame.current.ballY, 10); 

        
        if (stateGame.current.arrowLeft === true && stateGame.current.player1PaddleY > 0)
            stateGame.current.player1PaddleY = stateGame.current.player1PaddleY - 5;
        else if (stateGame.current.arrowRight === true && stateGame.current.player1PaddleY < 400 - stateGame.current.player1PaddleH)
        stateGame.current.player1PaddleY = stateGame.current.player1PaddleY + 5;
        
        ctx.fillStyle = "#00A308";
        rect(0, stateGame.current.player1PaddleY, stateGame.current.player1PaddleW, stateGame.current.player1PaddleH);

        if (stateGame.current.ballY + stateGame.current.ballDy + 10 > 400 || stateGame.current.ballY + stateGame.current.ballDy - 10 < 0) // Dépassement à droite ou à gauche
        {
            stateGame.current.ballDy = -stateGame.current.ballDy;
        }

        if (stateGame.current.ballX + stateGame.current.ballDx + 10 > 800)
        {
            stateGame.current.ballDx = -stateGame.current.ballDx;
        }
        else if (stateGame.current.ballX + stateGame.current.ballDx - 10 < stateGame.current.player1PaddleW) 
        {
            if (stateGame.current.ballY >= stateGame.current.player1PaddleY - 10 && stateGame.current.ballY <= stateGame.current.player1PaddleY + stateGame.current.player1PaddleH + 10)//10 = securite
            {
                // Si la balle rentre en collision avec la raquette, la balle rebondit
                stateGame.current.ballDx = -stateGame.current.ballDx;
                stateGame.current.ballDy = 8 * ((stateGame.current.ballY-(stateGame.current.player1PaddleY + stateGame.current.player1PaddleH/2))/stateGame.current.player1PaddleH);
            }
            else
            {
                // Sinon la balle revient au centre
                stateGame.current.ballX = 800/2;
                stateGame.current.ballY = 400/2;
            }
        }
       
        stateGame.current.ballX += stateGame.current.ballDx;
        stateGame.current.ballY += stateGame.current.ballDy;
    }


    const play:any = () =>
    {
        if (canvas != null && activeGame === false)
        {
            setActiveGame(true);
            init();
        }
    }



    

    
    return (
        <>
        {/*https://jill-jenn.net/conferences/cassebriques/move.html*/}

        <div className={clsx(classes.Game, ftShowGame(user))}>
            <canvas id={styles.canvas} width="800" height="400" onClick={()=>play()} tabIndex={0} onKeyDown={(event)=>keyDownHandler(event)} onKeyUp={(event)=>keyUpHandler(event)}></canvas>
        </div>


        <div className={clsx(classes.unauthorized, ftShowUnauthorized(user))}>
            <h1>You must log in to access this feature</h1>
        </div>

        </>
    );
}

export default Game;
