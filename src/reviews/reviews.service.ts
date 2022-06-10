import { ForbiddenException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
    try {
      const reviewRepository = getRepository(Review);
      const reviews = await reviewRepository.find({ relations: ['game', 'user' ]});
      return reviews.map((review) => { delete review.user.password; return review; });
    } catch (err) {
      if (err.status) throw new HttpException(err, err.status);
      throw new InternalServerErrorException('Sorry :\\');
    }
  }

  async findOne(id: string) {
    try {
      const reviewRepository = getRepository(Review);
      const review = await reviewRepository.findOne(id, { relations: ['game', 'user']});
      if (review) {
        delete review.user.password;
        return review;
      } else {
        throw new NotFoundException('Review not exists.');
      }
    } catch (err) {
      if (err.status) throw new HttpException(err, err.status);
      throw new InternalServerErrorException('Sorry :\\');
    }
  }

  async findByGame(gameID: string)
  {
    try {
      const reviewRepository = getRepository(Review);

      const reviews = await reviewRepository.find( 
        { 
          where: { 
            game: { id: gameID } 
          },
          relations: ['game', 'user'],
        }
      );
      
      if (reviews && reviews.length > 0) {
        return reviews.map((review) => { delete review.user.password; return review; });
      } else {
        throw new NotFoundException('Review not exists by this gameID');
      }
    } catch (err) {
      if (err.status) throw new HttpException(err, err.status);
      throw new InternalServerErrorException('Sorry :\\');
    }
  }

  async getReviewByUserAndGame(findReviewByGameDto: FindReviewByGameDTO, token: string) {
    try {
      const reviewRepository = getRepository(Review);
      const userData = jwt.verify(token, process.env.JWTSecret);

      if (!userData) throw new NotFoundException('User not found.');

      const review = await reviewRepository.findOne( 
        { 
          where: { 
            user: { id: userData.id }, 
            game: { id: findReviewByGameDto.game_id } 
          },
          relations: ['game', 'user'],
        }
      );

      if (review) {
        delete review.user.password;
        return review;
      } else {
        throw new NotFoundException('Review not exists by this user and game.');
      }
    } catch (err) {
      if (err.status) throw new HttpException(err, err.status);
      throw new InternalServerErrorException('Sorry :\\');
    }
  }

}
