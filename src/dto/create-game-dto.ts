import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsString } from "class-validator";

export class CreateGameDTO {

  @ApiProperty()
  @IsString()
  title: string;
  
  @ApiProperty()
  @IsString()
  slug: string;
  
  @ApiProperty()
  @IsString()
  thumbnail: string;
  
  @ApiProperty()
  @IsString()
  description: string;
  
  @ApiProperty()
  @IsString()
  genre: string;
  
  @ApiProperty()
  @IsString()
  platform: string;
  
  @ApiProperty()
  @IsString()
  publisher: string;
  
  @ApiProperty()
  @IsString()
  developer: string;
  
  @ApiProperty()
  @IsDate()
  release_date: Date;

}