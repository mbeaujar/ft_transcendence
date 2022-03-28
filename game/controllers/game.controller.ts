import { Controller } from '@nestjs/common';
import { GameService } from '../services/game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}
}
