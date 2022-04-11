import { Ball } from './ball';
import { Player } from './player';
import { Server } from 'socket.io';
import { IMatch } from '../entities/match.interface';
import { IUser } from 'src/users/interface/user.interface';
import { MatchService } from '../services/match/match.service';
import { UsersService } from 'src/users/services/user/users.service';
import { ConnectedUserService } from 'src/chat/services/connected-user/connected-user.service';
import { IPlayer } from '../entities/player.interface';
import { PlayerService } from '../services/player/player.service';

export const WIDTH = 800;
export const HEIGHT = 400;
export const PADDLEW = 10;
export const PADDLEH = 80;

export class Game {
  ball: Ball;
  interval: NodeJS.Timer;
  player1: Player;
  player2: Player;

  constructor(
    private match: IMatch,
    private readonly playerService: PlayerService,
    private readonly usersService: UsersService,
    private readonly connectedUserService: ConnectedUserService,
    private readonly server: Server,
  ) {
    // Init score
    this.match.players[0].score = 0;
    this.match.players[1].score = 0;
    // Instance of player
    this.player1 = new Player();
    this.player2 = new Player();
    // Instance of ball
    this.ball = new Ball();

    // Start Loop game with refresh rate of 100 ms (~ 100fps)
    this.interval = setInterval(this.loop.bind(this), 35);
  }

  // interval 10ms
  async loop() {
    // End of the game ?
    if (this.player1.score === 3 || this.player2.score === 3) {
      clearInterval(this.interval);
      this.match.players[0].score = this.player1.score;
      this.match.players[1].score = this.player2.score;
      await this.playerService.save(this.match.players[0]);
      await this.playerService.save(this.match.players[1]);

      let winner = this.player1.score === 3 ? 0 : 1;
      let loser = this.player1.score === 3 ? 1 : 0;
      this.match.players[winner].user.elo += 100;
      this.match.players[winner].user.wins++;
      if (this.match.players[loser].user.elo > 30) {
        this.match.players[loser].user.elo -= 100;
      } else {
        this.match.players[loser].user.elo = 0;
      }
      this.match.players[loser].user.losses++;
      await this.usersService.saveUser(this.match.players[0].user);
      await this.usersService.saveUser(this.match.players[1].user);

      return;
    }

    this.ballHitRightPaddle();

    this.ballHitLeftPaddle();

    await this.ballHitWall();

    this.ball.move();
    // send informations to all players and spectators
    this.sendPlayersInformation(this.match.players);
    this.sendSpectatorInformation(this.match.spectators);
  }

  moveTop(user: IUser) {
    if (user.id === this.match.players[0].user.id) {
      this.player1.top();
    } else if (user.id === this.match.players[1].user.id) {
      this.player2.top();
    }
  }

  moveBot(user: IUser) {
    if (user.id === this.match.players[0].user.id) {
      this.player1.bot();
    } else if (user.id === this.match.players[1].user.id) {
      this.player2.bot();
    }
  }

  async sendPlayersInformation(players: IPlayer[]) {
    for (const player of players) {
      const connectedPlayer = await this.connectedUserService.findByUser(
        player.user,
      );
      if (connectedPlayer) {
        this.server.to(connectedPlayer.socketId).emit('infoGame', {
          ballx: this.ball.x,
          bally: this.ball.y,
          player1: this.player1.y,
          player2: this.player2.y,
        });
      }
    }
  }

  async sendSpectatorInformation(spectators: IUser[]) {
    for (const spec of spectators) {
      const connectedSpecator = await this.connectedUserService.findByUser(
        spec,
      );
      if (connectedSpecator) {
        this.server.to(connectedSpecator.socketId).emit('infoGame', {
          ballx: this.ball.x,
          bally: this.ball.y,
          player1: this.player1.y,
          player2: this.player2.y,
        });
      }
    }
  }

  printInfoGame() {
    console.log('pos ball', this.ball.x, this.ball.y);
    console.log('pos p1', this.player1.y);
    console.log('pos p2', this.player2.y);
  }

  ballHitRightPaddle() {
    if (
      this.ball.y + this.ball.r >= this.player2.y - PADDLEH / 2 &&
      this.ball.y - this.ball.r <= this.player2.y + PADDLEH / 2 &&
      this.ball.x + this.ball.r + PADDLEW + 5 >= WIDTH
    ) {
      this.ball.dx = -this.ball.dx;
      this.ball.dy =
        8 * ((this.ball.y - (this.player2.y + PADDLEH / 2)) / PADDLEH);
    }
  }

  ballHitLeftPaddle() {
    if (
      this.ball.y + this.ball.r >= this.player1.y - PADDLEH / 2 &&
      this.ball.y - this.ball.r <= this.player1.y + PADDLEH / 2 &&
      this.ball.x - this.ball.r - PADDLEW - 5 <= 0
    ) {
      this.ball.dx = -this.ball.dx;
      this.ball.dy =
        8 * ((this.ball.y - (this.player1.y + PADDLEH / 2)) / PADDLEH);
    }
  }

  async ballHitWall() {
    if (this.ball.y + this.ball.r >= HEIGHT || this.ball.y - this.ball.r <= 0) {
      this.ball.dy = -this.ball.dy;
    }

    if (this.ball.x + this.ball.r >= WIDTH || this.ball.x - this.ball.r <= 0) {
      if (this.ball.x + this.ball.r >= WIDTH) {
        this.player1.goal();
      } else {
        this.player2.goal();
      }
      this.ball.reset();
      this.player1.reset();
      this.player2.reset();
      // send score to players
      for (const player of this.match.players) {
        const connectedPlayer = await this.connectedUserService.findByUser(
          player.user,
        );
        if (connectedPlayer) {
          this.server.to(connectedPlayer.socketId).emit('scoreGame', {
            score: [this.player1.score, this.player2.score],
          });
        }
      }
    }
  }
}
