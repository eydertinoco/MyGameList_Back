import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthUser } from 'src/dto/auth-user-dto';
import { CreateUserDTO } from 'src/dto/create-user-dto';
import { User } from 'src/entities/user.entity';
import { getRepository } from 'typeorm';

import * as dotenv from 'dotenv';
dotenv.config();

const bcryptjs = require('bcryptjs');

const jwt = require('jsonwebtoken');

@Injectable()
export class UsersService {

  async create(createUserDto: CreateUserDTO): Promise<User | null> {

    try {
      const userRepository = await getRepository(User);

      if ( await userRepository.findOne({ where: { email: createUserDto
      .email} })) {
        throw new HttpException(
          {
            statusbar: HttpStatus.FORBIDDEN,
            error: 'user already exist.'
          }, HttpStatus.FORBIDDEN,
        );
      }

      const user = userRepository.create();
      
      user.nickname = createUserDto.nickname;
      user.email = createUserDto.email;

      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(createUserDto.password, salt);
      
      user.password = hash;
  
      return await userRepository.save(user);

    } catch (err) {
      throw new HttpException({
        statusbar: HttpStatus.FORBIDDEN,
        error: err,
      }, HttpStatus.FORBIDDEN);
    }

  }

  async auth(authUser: AuthUser): Promise<string | null> {
    try {

      const userRepository = await getRepository(User);

      let user = await userRepository.findOne( { where: {email: authUser.account} } );
      if (!user) user = await userRepository.findOne( { where: {nickname: authUser.account} } );

      if (user) {
        const validatePassword = await bcryptjs.compare(authUser.password, user.password);

        if (validatePassword) {
          let token = await jwt.sign({id: user.id, email: user.email}, process.env.JWTSecret, {expiresIn: '48h'});

          return token;
        }
      }

      return null;
    } catch (err) {
      console.log(err);
    }
  }

  async findAll(): Promise<User[] | null> {
    try {
      const userRepository = await getRepository(User);
      const users = await userRepository.find({ select: ['id', 'nickname', 'email'] });
      return users;
    } catch (err) {
      console.log(err);
    }
    return null;
  }

}
