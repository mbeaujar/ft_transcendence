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
        width:Number(0),
        height:Number(0),
        ballX:Number(0),
        ballY:Number(0),
        ballDx:Number(0),
        ballDy:Number(0),
        player1Top:Boolean(false),
        player1Bottom:Boolean(false),
        player1PaddleW:Number(0),
        player1PaddleH:Number(0),
        player1PaddleY:Number(0),
        player2Top:Boolean(false),
        player2Bottom:Boolean(false),
        player2PaddleW:Number(0),
        player2PaddleH:Number(0),
        player2PaddleY:Number(0)
    });
    
    var canvas:any = document.getElementById(styles.canvas);
    var ctx:any;

    
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


    function init() 
    {
        ctx = canvas.getContext("2d");
        var style = window.getComputedStyle(canvas);

        stateGame.current.width = parseInt(style.getPropertyValue('width'));
        stateGame.current.height = parseInt(style.getPropertyValue('height'));
        
        stateGame.current.ballX = stateGame.current.width/2;
        stateGame.current.ballY = stateGame.current.height/2;
        stateGame.current.ballDx = 4;
        stateGame.current.ballDy = 2;

        stateGame.current.player1PaddleW = 10;
        stateGame.current.player1PaddleH = 75;
        stateGame.current.player1PaddleY = stateGame.current.height/2 - stateGame.current.player1PaddleH/2;

        stateGame.current.player2PaddleW = 10;
        stateGame.current.player2PaddleH = 75;
        stateGame.current.player2PaddleY = stateGame.current.height/2 - stateGame.current.player1PaddleH/2;
        
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
        ctx.clearRect(0, 0, stateGame.current.width, stateGame.current.height);
    }


    const keyDownHandler = (event: React.KeyboardEvent<Element>) => {
        if (event.code === "ArrowLeft") 
        {
            stateGame.current.player1Top = true;
        }
        
        if (event.code === "ArrowRight") 
        {
            stateGame.current.player1Bottom = true;
        }

        if (event.code === "KeyA") 
        {
            stateGame.current.player2Top = true;
        }

        if (event.code === "KeyD") 
        {
            stateGame.current.player2Bottom = true;
        }
        
    };

    const keyUpHandler = (event: React.KeyboardEvent<Element>) => {
        if (event.code === "ArrowLeft") 
        {
            stateGame.current.player1Top = false;
        }
        
        if (event.code === "ArrowRight") 
        {
            stateGame.current.player1Bottom = false;
        }

        if (event.code === "KeyA") 
        {
            stateGame.current.player2Top = false;
        }

        if (event.code === "KeyD") 
        {
            stateGame.current.player2Bottom = false;
        }
    };
    
    

    function draw() 
    {
        clear();
        ctx.fillStyle = "#FFFFFF";
        circle(stateGame.current.ballX, stateGame.current.ballY, 10); 

        
        if (stateGame.current.player1Top === true && stateGame.current.player1PaddleY > 0)
            stateGame.current.player1PaddleY = stateGame.current.player1PaddleY - 5;
        else if (stateGame.current.player1Bottom === true && stateGame.current.player1PaddleY < stateGame.current.height - stateGame.current.player1PaddleH)
            stateGame.current.player1PaddleY = stateGame.current.player1PaddleY + 5;
        ctx.fillStyle = "#00A308";
        rect(0, stateGame.current.player1PaddleY, stateGame.current.player1PaddleW, stateGame.current.player1PaddleH);

        if (stateGame.current.player2Top === true && stateGame.current.player2PaddleY > 0)
            stateGame.current.player2PaddleY = stateGame.current.player2PaddleY - 5;
        else if (stateGame.current.player2Bottom === true && stateGame.current.player2PaddleY < stateGame.current.height - stateGame.current.player2PaddleH)
            stateGame.current.player2PaddleY = stateGame.current.player2PaddleY + 5;
        ctx.fillStyle = "#2ddff3";
        rect(stateGame.current.width - stateGame.current.player2PaddleW, stateGame.current.player2PaddleY, stateGame.current.player2PaddleW, stateGame.current.player2PaddleH);

        if (stateGame.current.ballY + stateGame.current.ballDy + 10 > stateGame.current.height || stateGame.current.ballY + stateGame.current.ballDy - 10 < 0) // Collision haut et bas
        {
            stateGame.current.ballDy = -stateGame.current.ballDy;
        }

        if (stateGame.current.ballX + stateGame.current.ballDx + 10 > stateGame.current.width)
        {
            stateGame.current.ballDx = -stateGame.current.ballDx;
        }
        else if (stateGame.current.ballX + stateGame.current.ballDx - 10 < stateGame.current.player1PaddleW || 
            stateGame.current.ballX + stateGame.current.ballDx + 10 > stateGame.current.width - stateGame.current.player2PaddleW) 
        {
            if (stateGame.current.ballY >= stateGame.current.player1PaddleY - 10 && stateGame.current.ballY <= stateGame.current.player1PaddleY + stateGame.current.player1PaddleH + 10)//10 = securite
            {
                // Si la balle rentre en collision avec la raquette du joueur 1 , la balle rebondit
                stateGame.current.ballDx = -stateGame.current.ballDx;
                stateGame.current.ballDy = 8 * ((stateGame.current.ballY-(stateGame.current.player1PaddleY + stateGame.current.player1PaddleH/2))/stateGame.current.player1PaddleH);
            }
            else if (stateGame.current.ballY >= stateGame.current.player2PaddleY - 10 && stateGame.current.ballY <= stateGame.current.player2PaddleY + stateGame.current.player2PaddleH + 10)
            {
                // Si la balle rentre en collision avec la raquette du joueur 1 , la balle rebondit
                stateGame.current.ballDx = -stateGame.current.ballDx;
                stateGame.current.ballDy = 8 * ((stateGame.current.ballY-(stateGame.current.player2PaddleY + stateGame.current.player2PaddleH/2))/stateGame.current.player2PaddleH);
            }
            else
            {
                // Sinon la balle revient au centre
                stateGame.current.ballX = stateGame.current.width/2;
                stateGame.current.ballY = stateGame.current.height/2;
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
