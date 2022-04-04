import { Ball } from './ball';
import { Player } from './player';
import { IMatch } from '../entities/match.interface';
import { MatchService } from '../services/match/match.service';
import { Injectable } from '@nestjs/common';
import { ConnectedUserService } from 'src/chat/services/connected-user/connected-user.service';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { IUser } from 'src/users/interface/user.interface';

export class Game {
  ball: Ball;
  interval: NodeJS.Timer;
  end: boolean;
  player1: Player;
  player2: Player;

  constructor(
    private readonly match: IMatch,
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
      // await this.matchService.save(this.match);
      // add elo for winner and loser
      clearInterval(this.interval);
    }
    // Ball touche un paddle ?

    // ball touche un mur ?

    // send informations to all players and spectators
    this.sendPlayerInformation(this.player1, this.match.players[0].user, true);
    this.sendPlayerInformation(this.player2, this.match.players[1].user, false);
    this.sendSpectatorInformation(this.match.spectators);
  }

  async sendPlayerInformation(player: Player, user: IUser, isLeft: boolean) {
    const connectedPlayer = await this.connectedUserService.findByUser(user);
    if (connectedPlayer) {
      this.server.to(connectedPlayer.socketId).emit('infoGame', {
        isLeft,
        y: player.y,
        bx: this.ball.x,
        by: this.ball.y,
      });
    }
  }

  async sendSpectatorInformation(spectators: IUser[]) {
    for (const spec of spectators) {
      const connectedSpecator = await this.connectedUserService.findByUser(
        spec,
      );
      if (connectedSpecator) {
        this.server.to(connectedSpecator.socketId).emit('infoGame', {});
      }
    }
  }
}
