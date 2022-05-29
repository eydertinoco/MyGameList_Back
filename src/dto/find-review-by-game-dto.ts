import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class FindReviewByGameDTO {
  
  
  @ApiProperty()
  @IsUUID()
  game_id: string;
}