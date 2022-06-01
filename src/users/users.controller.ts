import { Body, Controller, Get, Patch, Post, Response } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/dto/auth-user-dto';
import { ChangePasswordDto } from 'src/dto/change-password-dto';
import { CreateUserDTO } from 'src/dto/create-user-dto';
import { ForgotPasswordDTO } from 'src/dto/forgot-password-dto';
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
  auth(@Body() authUser: AuthUser) {
    return this.usersService.auth(authUser);
  }

  @Post('/forgot')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDTO) {
    return this.usersService.forgotPassword(forgotPasswordDto);
  }

  @Post('/change_password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(changePasswordDto);
  }

  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
