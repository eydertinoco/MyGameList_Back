import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthUser } from 'src/dto/auth-user-dto';
import { CreateUserDTO } from 'src/dto/create-user-dto';
import { User } from 'src/entities/user.entity';
import { getRepository } from 'typeorm';

import * as dotenv from 'dotenv';
import { ForgotPasswordDTO } from 'src/dto/forgot-password-dto';
import { ChangePasswordDto } from 'src/dto/change-password-dto';
dotenv.config();

const bcryptjs = require('bcryptjs');

const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer');

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDTO): Promise<User | null> {
    try {
      const userRepository = await getRepository(User);

      const user = userRepository.create();

      user.nickname = createUserDto.nickname;
      user.email = createUserDto.email;

      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(createUserDto.password, salt);

      user.password = hash;

      return await userRepository.save(user);
    } catch (err) {
      throw new HttpException(
        {
          statusbar: HttpStatus.FORBIDDEN,
          error: err,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async auth(authUser: AuthUser): Promise<string | null> {
    try {
      const userRepository = await getRepository(User);

      let user = await userRepository.findOne({
        where: { email: authUser.account },
      });
      if (!user)
        user = await userRepository.findOne({
          where: { nickname: authUser.account },
        });

      if (user) {
        const validatePassword = await bcryptjs.compare(
          authUser.password,
          user.password,
        );

        if (validatePassword) {
          let token = await jwt.sign(
            { id: user.id, nickname: user.nickname, email: user.email },
            process.env.JWTSecret,
            { expiresIn: '48h' },
          );

          return token;
        }
      }

      return null;
    } catch (err) {
      console.log(err);
    }
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDTO,
  ): Promise<string | null> {
    const transport = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '846daea9eb397f',
        pass: '1575ab21b11200',
      },
    });

    try {
      const userRepository = getRepository(User);

      const user = await userRepository.findOne({
        where: { email: forgotPasswordDto.email },
      });

      const token = await jwt.sign({ id: user.id }, process.env.JWTSecret, {
        expiresIn: '2h',
      });

      if (user) {
        await transport.sendMail({
          from: 'Equipe MyGameList <reply@mygamelist.com.br>',
          to: `${user.email}`,
          subject: `Ol?? ${user.nickname}, recebemos um pedido de altera????o de senha.`,
          html: `
            <p>Voc?? pode alter??-la no link: 
              <a style="text-decoration: none; color: '#8282ff'; font-weight: bold; "  href="http://localhost:8080/changepassword?token=${token}">alterar senha</a>
            </p> 

            <br>
            <a href="https://my-game-list-front.vercel.app/">
              <img width="100" src="https://my-game-list-front.vercel.app/img/Controle.fb37a529.png" />
            </a>
            <h2>MyGameList Ltda.</h2>
          `,
        });
      }
    } catch (err) {
      throw new BadRequestException(err);
    }

    return 'alterado com sucesso';
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    jwt.verify(
      changePasswordDto.token,
      process.env.JWTSecret,
      async (err, decoded) => {
        if (err) {
          throw new HttpException('Invalidated Token', HttpStatus.UNAUTHORIZED);
        } else {
          try {
            const user = await getRepository(User).findOneOrFail(decoded.id);
            if (user) {
              const salt = await bcryptjs.genSalt(10);
              const hash = await bcryptjs.hash(
                changePasswordDto.newPassword,
                salt,
              );

              const updateUser = await getRepository(User).update(decoded.id, {
                password: hash,
              });
              return updateUser;
            } else {
              throw new BadRequestException('User n??o encotrado');
            }
          } catch (error) {
            throw new BadRequestException(error);
          }
        }
      },
    );
  }

  async findAll(): Promise<User[] | null> {
    try {
      const userRepository = await getRepository(User);
      const users = await userRepository.find({
        select: ['id', 'nickname', 'email'],
      });
      return users;
    } catch (err) {
      console.log(err);
    }
    return null;
  }

  async userLogged(token: string): Promise<User | null> {
    let user = null;
    jwt.verify(token, process.env.JWTSecret, (err, decoded) => {
      if (err) {
        throw new HttpException('Invalidated Token', HttpStatus.UNAUTHORIZED);
      } else {
        user = { id: decoded.id, username: decoded.nickname, email: decoded.email };
        return user;
      }
    });
    return user;
  }
}
