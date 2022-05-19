import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDTO } from 'src/dto/create-review-dto';
import { Game } from 'src/entities/game.entity';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { GamesService } from 'src/games/games.service';
import { getRepository } from 'typeorm';

import * as dotenv from 'dotenv';
import { FindReviewByGamerDTO } from 'src/dto/find-review-by-game-dto';

const jwt = require('jsonwebtoken');

@Injectable()
export class ReviewsService {

  async create(createReviewDto: CreateReviewDTO, token: string) {
    try {

      const reviewRepository = getRepository(Review);
      const gameRepository = getRepository(Game);
      const userRepository = getRepository(User);

      const review = reviewRepository.create();

      review.comment = createReviewDto.comment;
      review.rate = createReviewDto.rate;

      const userData = jwt.verify(token, process.env.JWTSecret);
      
      const user = await userRepository.findOne(userData.id);
      const game = await gameRepository.findOne(createReviewDto.game_id);

      if (user) {
        review.user = user;

        if (game) {
          review.game = game;
          return await reviewRepository.save(review);
        } else {
          throw new HttpException({
            statusbar: HttpStatus.NOT_FOUND,
            error: 'Game not found.',
          }, HttpStatus.NOT_FOUND);
        }

      } else {
        throw new HttpException({
          statusbar: HttpStatus.NOT_FOUND,
          error: 'User not found.',
        }, HttpStatus.NOT_FOUND);
      }
      

    } catch(err) {
      throw new HttpException({
        statusbar: HttpStatus.FORBIDDEN,
        error: err,
      }, HttpStatus.FORBIDDEN);
    }
  }

  async getReviewByUserAndGame(findReviewByGameDto: FindReviewByGamerDTO, token: string) {
    const reviewRepository = getRepository(Review);

    const userData = jwt.verify(token, process.env.JWTSecret);

    const review = await reviewRepository.findOne( 
      { 
        where: { 
          user: { id: userData.id }, 
          game: { id: findReviewByGameDto.game_id } 
        },
      }
    );

    return review;
  }

}
