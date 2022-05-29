import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AuthUser {

  @ApiProperty()
  @IsString()
  account: string;

  @ApiProperty()
  @IsString()
  password: string;

}