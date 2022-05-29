import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDTO } from 'src/dto/create-review-dto';
import { Game } from 'src/entities/game.entity';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { getRepository } from 'typeorm';

import { FindReviewByGameDTO } from 'src/dto/find-review-by-game-dto';

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

      if ( !user ) throw new NotFoundException('User not found.');
      if ( !game ) throw new NotFoundException('Game not found.'); 
      review.user = user;
      review.game = game;
      return await reviewRepository.save(review);

    } catch(err) {
      throw new ForbiddenException(err);
    }
  }

  async findAll() {
    const reviewRepository = getRepository(Review);
    const reviews = await reviewRepository.find({ relations: ['game', 'user' ]});
    return reviews.map((review) => { delete review.user.password; return review; });
  }

  async findOne(id: string) {
    const reviewRepository = getRepository(Review);
    const review = await reviewRepository.findOne(id, { relations: ['game', 'user']});
    delete review.user.password;
    return review;
  }

  async getReviewByUserAndGame(findReviewByGameDto: FindReviewByGameDTO, token: string) {
    const reviewRepository = getRepository(Review);

    const userData = jwt.verify(token, process.env.JWTSecret);

    const review = await reviewRepository.findOne( 
      { 
        where: { 
          user: { id: userData.id }, 
          game: { id: findReviewByGameDto.game_id } 
        },
        relations: ['game', 'user'],
      }
    );

    delete review.user.password;

    return review;
  }

}
