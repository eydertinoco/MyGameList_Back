import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class CreateReviewDTO {

  @ApiProperty()
  @IsString()
  comment: string;
  
  @ApiProperty()
  @IsBoolean()
  rate: boolean;
  
  @ApiProperty()
  @IsString()
  game_id: string;

}