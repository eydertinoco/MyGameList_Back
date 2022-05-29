import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString, IsUUID } from "class-validator";

export class CreateReviewDTO {

  @ApiProperty()
  @IsString()
  comment: string;
  
  @ApiProperty()
  @IsBoolean()
  rate: boolean;
  
  @ApiProperty()
  @IsUUID()
  game_id: string;

}