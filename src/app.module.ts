import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './entities/user.entity';
import { AuthMiddleware } from './middleware/auth.middleware';
import { GamesModule } from './games/games.module';
import { Game } from './entities/game.entity';
import { ReviewsModule } from './reviews/reviews.module';
import { Review } from './entities/review.entity';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Game, Review],
      synchronize: true,
      logging: ['error'],
    }),
    UsersModule,
    GamesModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude(
      { path: 'users', method: RequestMethod.POST },
    ).forRoutes(
      { path: 'users', method: RequestMethod.GET }, 
      { path: 'reviews', method: RequestMethod.ALL }
    );
  }

}
