import { Body, Controller, Get, Post, Response } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/dto/auth-user-dto';
import { CreateUserDTO } from 'src/dto/create-user-dto';
import { User } from 'src/entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDTO) {
    return this.usersService.create(createUserDto);
  }

  @Post('/auth')
  auth(@Body() authUser: AuthUser ) {
    return this.usersService.auth(authUser);
  }

  @ApiBearerAuth()
  @Get()
  findAll() { 
    return this.usersService.findAll();
  }
}
