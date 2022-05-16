import { Body, Controller, Post } from '@nestjs/common';
import { CreateReviewDTO } from 'src/dto/create-review-dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() createReviewDto: CreateReviewDTO) {
    return this.reviewsService.create(createReviewDto);
  }
}
