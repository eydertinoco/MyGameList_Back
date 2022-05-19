import { Body, Controller, Post, Request } from '@nestjs/common';
import { CreateReviewDTO } from 'src/dto/create-review-dto';
import { ReviewsService } from './reviews.service';

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
}
