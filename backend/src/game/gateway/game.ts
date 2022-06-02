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
    this.player1 = new Player(
      this.match.players[0].user.sensitivity,
      PADDLEH,
      this.match.players[0].user.username,
    );
    this.player2 = new Player(
      this.match.players[1].user.sensitivity,
      PADDLEH,
      this.match.players[1].user.username,
    );
    this.ball = new Ball();
    this.player1.leave = false;
    this.player2.leave = false;

    // Start Loop game with refresh rate of 100 ms (~ 100fps)
    this.interval = setInterval(this.loop.bind(this), 20);
  }

  async loop() {
    if (this.player1.leave === true || this.player2.leave === true) {
      if (this.player1.leave === true) {
        this.player1.score = 0;
        this.player2.score = 3;
      } else if (this.player2.leave === true) {
        this.player1.score = 3;
        this.player2.score = 0;
      }
      const score: IScore = {
        score: [this.player1.score, this.player2.score],
      };
      // send score to players
      await this.sendPlayersInformation(
        [this.match.players[0].user, this.match.players[1].user],
        'scoreGame',
        score,
      );
      await this.sendSpectatorsInformation(
        this.match.spectators,
        'scoreGame',
        score,
      );
    }

    if (this.player1.score === 3 || this.player2.score === 3) {
      clearInterval(this.interval);
      this.endGame();
      // console.log('live ==> ', this.match.live);
      return ;
    }

    if (this.match.mode === GameMode.draw) {
      if (this.blink >= 20) {
        this.blink = 0;
      } else {
        this.blink++;
      }
      this.drawingState(this.player1);
      this.drawingState(this.player2);
    }

    this.ballHitRightPaddle();

    this.ballHitLeftPaddle();

    await this.ballHitWall();

    this.ball.move();

    const infoGame: IInfoGame = {
      id: this.match.id,
      ballx: this.calculPercentage(this.ball.x, WIDTH),
      bally: this.calculPercentage(this.ball.y, HEIGHT),
      player1: this.calculPercentage(this.player1.y, HEIGHT),
      player2: this.calculPercentage(this.player2.y, HEIGHT),
      paddleh1: this.calculPercentage(this.player1.paddleh, HEIGHT),
      paddleh2: this.calculPercentage(this.player2.paddleh, HEIGHT),
    };
    await this.sendPlayersInformation(
      [this.match.players[0].user, this.match.players[1].user],
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
    if (player.score === 1 && this.blink > 10) {
      player.draw = false;
    } else if (player.score === 2 && this.blink < 15) {
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
      this.match.players[loser].user.losses++;

      if (this.match.players[loser].user.elo > 30) {
        this.match.players[loser].user.elo -= 30;
      } else {
        this.match.players[loser].user.elo = 0;
      }
    }
    this.match.players[0].user.rank = this.setRank(
      this.match.players[0].user.elo,
    );
    this.match.players[1].user.rank = this.setRank(
      this.match.players[1].user.elo,
    );
    this.match.players[0].user.state = State.online;
    this.match.players[1].user.state = State.online;
    await this.usersService.saveUser(this.match.players[0].user);
    await this.usersService.saveUser(this.match.players[1].user);
  }

  setRank(points: number) {
    if (points < 100) return 'Bronze 3';
    else if (points < 200) return 'Bronze 2';
    else if (points < 300) return 'Bronze 1';
    else if (points < 400) return 'Silver 3';
    else if (points < 500) return 'Silver 2';
    else if (points < 600) return 'Silver 1';
    else if (points < 700) return 'Gold 3';
    else if (points < 800) return 'Gold 2';
    else if (points < 900) return 'Gold 1';
    else if (points < 1000) return 'Elite 3';
    else if (points < 1100) return 'Elite 2';
    else return 'Elite 1';
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

  leaveGame(user: IUser) {
    if (user.id === this.match.players[0].user.id) {
      this.player1.leaveGame();
    } else if (user.id === this.match.players[1].user.id) {
      this.player2.leaveGame();
    }
  }

  async addSpectatorToGame(user: User) {
    this.match.spectators.push(user);
    this.match = await this.matchService.save(this.match);
    return ([this.player1.score,this.player2.score])
  }

  async sendPlayersInformation(users: User[], emitMessage: string, info: any) {
    if (emitMessage === 'infoGame') {
      if (this.player1.draw === false) {
        info.player1 = undefined;
        info.paddleh1 = undefined;
      }
      if (this.player2.draw === false) {
        info.player2 = undefined;
        info.paddleh2 = undefined;
      }
    }
    const connectedPlayer1 = await this.connectedUserService.findByUserAndMode(
      users[0],
      Mode.game,
    );
    if (connectedPlayer1) {
      this.server.to(connectedPlayer1.socketId).emit(emitMessage, info);
    }
    const connectedPlayer2 = await this.connectedUserService.findByUserAndMode(
      users[1],
      Mode.game,
    );
    if (connectedPlayer2) {
      this.server.to(connectedPlayer2.socketId).emit(emitMessage, info);
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
      this.ball.dx *= -1.00;
      // this.ball.dy =
        // 8.5 * ((this.ball.y - (this.player2.y + PADDLEH / 2)) / PADDLEH);
    }
  }

  ballHitLeftPaddle() {
    if (
      this.ball.y + this.ball.r >= this.player1.y - PADDLEH / 2 &&
      this.ball.y - this.ball.r <= this.player1.y + PADDLEH / 2 &&
      this.ball.x - this.ball.r - PADDLEW - 5 <= 0
    ) {
      this.ball.dx *= -1.00;
      // this.ball.dy =
      //   8.5 * ((this.ball.y - (this.player1.y + PADDLEH / 2)) / PADDLEH);
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
      await this.sendPlayersInformation(
        [this.match.players[0].user, this.match.players[1].user],
        'scoreGame',
        score,
      );
      this.sendSpectatorsInformation(this.match.spectators, 'scoreGame', score);
    }
  }
}
