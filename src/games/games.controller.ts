import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateGameDTO } from 'src/dto/create-game-dto';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}


  @Post()
  create(@Body() createGameDto: CreateGameDTO ) {
    return this.gamesService.create(createGameDto);
  }

  @Get()
  findAll() {
    return this.gamesService.findAll();
  }
}
