import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from 'src/game/entities/player.entity';
import { IPlayer } from 'src/game/entities/player.interface';
import { Repository } from 'typeorm';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async create(playerDetails: IPlayer): Promise<Player> {
    const player = this.playerRepository.create(playerDetails);
    return this.playerRepository.save(player);
  }

  async update(player: IPlayer, attrs: Partial<Player>): Promise<Player> {
    Object.assign(player, attrs);
    return this.playerRepository.save(player);
  }

  async delete(id: number) {
    return this.playerRepository.delete(id);
  }
}
