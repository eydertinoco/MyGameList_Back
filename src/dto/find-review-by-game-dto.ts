import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class FindReviewByGamerDTO {
  
  
  @ApiProperty()
  @IsUUID()
  game_id: string;
}