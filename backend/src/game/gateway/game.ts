import { Ball } from './ball';
import { Player } from './player';
import { Server } from 'socket.io';
import { IUser } from 'src/users/model/user/user.interface';
import { MatchService } from '../services/match.service';
import { IMatch } from '../model/match/match.interface';
import { PlayerService } from '../services/player.service';
import { UsersService } from 'src/users/users.service';
import { ConnectedUserService } from 'src/chat/services/connected-user.service';
import { User } from 'src/users/model/user/user.entity';
import { IPlayer } from '../model/player/player.interface';
import { IInfoGame } from '../model/info-game.interface';
import { IScore } from '../model/score.interface';
import { State } from 'src/users/model/state.enum';
import { GameMode } from '../model/gamemode.enum';
import { Mode } from 'src/chat/model/connected-user/mode.enum';

export const WIDTH = 800;
export const HEIGHT = 400;
export const PADDLEW = 10;
export const PADDLEH = 80;

export class Game {
  ball: Ball;
  interval: NodeJS.Timer;
  player1: Player;
  player2: Player;
  blink: number;

  constructor(
    private match: IMatch,
    private readonly matchService: MatchService,
    private readonly playerService: PlayerService,
    private readonly usersService: UsersService,
    private readonly connectedUserService: ConnectedUserService,
    private readonly server: Server,
  ) {
    this.blink = 0;
    this.match.players[0].score = 0;
    this.match.players[1].score = 0;
    this.player1 = new Player(this.match.players[0].user.sensitivity, PADDLEH);
    this.player2 = new Player(this.match.players[1].user.sensitivity, PADDLEH);
    this.ball = new Ball();

    // Start Loop game with refresh rate of 100 ms (~ 100fps)
    this.interval = setInterval(this.loop.bind(this), 35);
  }

  async loop() {
    if (this.player1.score === 3 || this.player2.score === 3) {
      clearInterval(this.interval);
      this.endGame();
      return;
    }
    this.match.mode === GameMode.draw;
    if (this.blink >= 1000) this.blink = 0;
    else this.blink++;
    this.ballHitRightPaddle();

    this.ballHitLeftPaddle();

    await this.ballHitWall();

    this.ball.move();

    const infoGame: IInfoGame = {
      ballx: this.calculPercentage(this.ball.x, WIDTH),
      bally: this.calculPercentage(this.ball.y, HEIGHT),
      player1: this.calculPercentage(this.player1.y, HEIGHT),
      player2: this.calculPercentage(this.player2.y, HEIGHT),
      paddleh1: this.calculPercentage(this.player1.paddleh, HEIGHT),
      paddleh2: this.calculPercentage(this.player2.paddleh, HEIGHT),
    };
    await this.sendPlayersInformation(
      this.match.players[0],
      this.player1,
      'infoGame',
      infoGame,
    );
    await this.sendPlayersInformation(
      this.match.players[1],
      this.player2,
      'infoGame',
      infoGame,
    );
    await this.sendSpectatorsInformation(
      this.match.spectators,
      'infoGame',
      infoGame,
    );
  }

  drawingState(player: Player) {
    if (player.score === 1 && this.blink > 500) {
      player.draw = false;
    } else if (this.player1.score === 2 || this.player2.score === 2) {
      player.draw = false;
    } else {
      player.draw = true;
    }
  }

  calculPercentage(pos: number, sub: number) {
    return (pos * 100) / sub;
  }

  async endGame() {
    this.match.players[0].score = this.player1.score;
    this.match.players[1].score = this.player2.score;
    await this.playerService.save(this.match.players[0]);
    await this.playerService.save(this.match.players[1]);

    await this.matchService.update(this.match, { live: 0 });
    if (this.match.mode === GameMode.default) {
      let winner = this.player1.score === 3 ? 0 : 1;
      let loser = this.player1.score === 3 ? 1 : 0;
      this.match.players[winner].user.elo += 30;
      this.match.players[winner].user.wins++;
      if (this.match.players[loser].user.elo > 30) {
        this.match.players[loser].user.elo -= 30;
      } else {
        this.match.players[loser].user.elo = 0;
      }
      this.match.players[loser].user.losses++;
    }
    this.match.players[0].user.state = State.online;
    this.match.players[1].user.state = State.online;
    await this.usersService.saveUser(this.match.players[0].user);
    await this.usersService.saveUser(this.match.players[1].user);
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

  async addSpectatorToGame(user: User) {
    this.match.spectators.push(user);
    this.match = await this.matchService.save(this.match);
  }

  async sendPlayersInformation(
    players: IPlayer,
    player: Player,
    emitMessage: string,
    info: any,
  ) {
    if (player.draw === false && emitMessage === 'infoGame') {
      info = { ballx: info.ballx, bally: info.bally };
    }
    const connectedPlayer = await this.connectedUserService.findByUserAndMode(
      players.user,
      Mode.game,
    );
    if (connectedPlayer) {
      this.server.to(connectedPlayer.socketId).emit(emitMessage, info);
    }
  }

  async sendSpectatorsInformation(
    spectators: IUser[],
    emitMessage: string,
    info: IInfoGame | IScore,
  ) {
    for (const spec of spectators) {
      const connectedSpecator =
        await this.connectedUserService.findByUserAndMode(spec, Mode.game);
      if (connectedSpecator) {
        this.server.to(connectedSpecator.socketId).emit(emitMessage, info);
      }
    }
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
        if (this.match.mode === GameMode.paddle) this.player1.paddleh /= 2;
      } else {
        this.player2.goal();
        if (this.match.mode === GameMode.paddle) this.player2.paddleh /= 2;
      }
      this.ball.reset();
      this.player1.reset();
      this.player2.reset();
      const score: IScore = {
        score: [this.player1.score, this.player2.score],
      };
      // send score to players
      this.sendPlayersInformation(
        this.match.players[0],
        this.player1,
        'scoreGame',
        score,
      );
      this.sendPlayersInformation(
        this.match.players[1],
        this.player2,
        'scoreGame',
        score,
      );
      this.sendSpectatorsInformation(this.match.spectators, 'scoreGame', score);
    }
  }
}
