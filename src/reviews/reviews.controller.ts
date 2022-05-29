import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateReviewDTO } from 'src/dto/create-review-dto';
import { FindReviewByGameDTO } from 'src/dto/find-review-by-game-dto';
import { ReviewsService } from './reviews.service';

@ApiTags('reviews')
@ApiBearerAuth()
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() createReviewDto: CreateReviewDTO, @Request() req) {

    const auth = req.headers['authorization'];
    if ( !auth ) return;
    
    const token = auth.split(' ')[1];

    return this.reviewsService.create(createReviewDto, token);
  }

  @Get(':id')
  findByGame(@Param() param, @Request() req) {
    const auth = req.headers['authorization'];
    if ( !auth ) return "Token Invalidate";
    
    const token = auth.split(' ')[1];

    const review = new FindReviewByGameDTO();
    review.game_id = param.id;

    return this.reviewsService.getReviewByUserAndGame(review, token);
  }
}
