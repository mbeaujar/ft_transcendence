import { Ball } from './ball';
import { Player } from './player';
import { Server } from 'socket.io';
import { IMatch } from '../entities/match.interface';
import { IUser } from 'src/users/interface/user.interface';
import { MatchService } from '../services/match/match.service';
import { UsersService } from 'src/users/services/user/users.service';
import { ConnectedUserService } from 'src/chat/services/connected-user/connected-user.service';
import { IPlayer } from '../entities/player.interface';

export const WIDTH = 800;
export const HEIGHT = 400;
export const PADDLEW = 10;
export const PADDLEH = 75;

export class Game {
  ball: Ball;
  interval: NodeJS.Timer;
  end: boolean;
  player1: Player;
  player2: Player;

  constructor(
    private readonly match: IMatch,
    private readonly matchService: MatchService,
    private readonly usersService: UsersService,
    private readonly connectedUserService: ConnectedUserService,
    private readonly server: Server,
  ) {
    this.match.players[0].score = 0;
    this.match.players[1].score = 0;
    this.interval = setInterval(this.loop.bind(this), 10);
  }

  // interval 10ms
  async loop() {
    // fin de game ??
    if (this.player1.score === 3 || this.player2.score === 3) {
      this.match.players[0].score = this.player1.score;
      this.match.players[1].score = this.player2.score;
      await this.matchService.save(this.match);
      this.match.players[0].user.elo += 30;
      this.match.players[0].user.wins++;
      this.match.players[1].user.elo -= 30;
      this.match.players[1].user.losses++;
      await this.usersService.saveUser(this.match.players[0].user);
      await this.usersService.saveUser(this.match.players[1].user);

      clearInterval(this.interval);
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
      // Player1 move top
      this.player1.top();
    } else if (user.id === this.match.players[1].user.id) {
      // Player2 move top
      this.player2.top();
    }
  }

  moveBot(user: IUser) {
    if (user.id === this.match.players[0].user.id) {
      // Player1 move bot
      this.player1.bot();
    } else if (user.id === this.match.players[1].user.id) {
      // Player2 move bot
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

  ballHitRightPaddle() {
    if (
      this.player2.y + PADDLEH / 2 <= this.ball.y &&
      this.player2.y - PADDLEH / 2 >= this.ball.y &&
      this.ball.x >= 775
    ) {
      this.ball.dx = -this.ball.dx;
      this.ball.dy =
        8 * ((this.ball.y - (this.player2.y + PADDLEH / 2)) / PADDLEH);
    }
  }

  ballHitLeftPaddle() {
    // Ball touche un paddle gauche
    if (
      this.player1.y + PADDLEH / 2 <= this.ball.y &&
      this.player1.y - PADDLEH / 2 >= this.ball.y &&
      this.ball.x <= 25
    ) {
      this.ball.dx = -this.ball.dx;
      this.ball.dy =
        8 * ((this.ball.y - (this.player1.y + PADDLEH / 2)) / PADDLEH);
    }
  }

  async ballHitWall() {
    if (this.ball.y >= HEIGHT || this.ball.y <= 0) {
      this.ball.dy = -this.ball.dy;
    }

    if (this.ball.x >= WIDTH || this.ball.x <= 0) {
      if (this.ball.x >= WIDTH) {
        this.player1.goal();
      } else {
        this.player2.goal();
      }
      this.ball.reset();
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
