import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGameDTO } from 'src/dto/create-game-dto';
import { Game } from 'src/entities/game.entity';
import { getRepository } from 'typeorm';

@Injectable()
export class GamesService {

  async create(createGameDto: CreateGameDTO) {
    try {

      const gameRepository = getRepository(Game);

      const game = gameRepository.create();

      if (!createGameDto.title && !createGameDto.slug && !createGameDto.thumbnail &&
        !createGameDto.description && !createGameDto.genre && !createGameDto.platform &&
        !createGameDto.publisher && !createGameDto.developer && !createGameDto.release_date) {
        throw new HttpException({
          statusbar: HttpStatus.NOT_ACCEPTABLE,
          error: 'Invalidate Data',
        }, HttpStatus.NOT_ACCEPTABLE);
      }

      game.title = createGameDto.title;
      game.slug = createGameDto.slug;
      game.thumbnail = createGameDto.thumbnail;
      game.description = createGameDto.description;
      game.genre = createGameDto.genre;
      game.platform = createGameDto.platform;
      game.publisher = createGameDto.publisher;
      game.developer = createGameDto.developer;
      game.release_date = createGameDto.release_date;

      return await gameRepository.save(game);

    } catch (err) {
      throw new HttpException({
        statusbar: HttpStatus.FORBIDDEN,
        error: err,
      }, HttpStatus.FORBIDDEN);
    }

  }

  async findAll() {
    try {

      const gameRepository = getRepository(Game);
      return await gameRepository.find();

    } catch (err) {
      throw new HttpException({
        statusbar: HttpStatus.NOT_FOUND,
        error: err,
      }, HttpStatus.NOT_FOUND);
    }
  }

}
