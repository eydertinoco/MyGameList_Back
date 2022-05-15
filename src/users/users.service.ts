import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/dto/create-user-dto';
import { User } from 'src/entities/user.entity';
import { getConnection, getRepository } from 'typeorm';

@Injectable()
export class UsersService {

  async create(createUserDto: CreateUserDTO): Promise<User | null> {
    
    console.log(createUserDto);

    const userRepository = await getRepository(User);
    const user = userRepository.create();
    
    user.nickname = createUserDto.password;
    user.email = createUserDto.email;
    user.password = createUserDto.password;

    return await userRepository.save(user);

  }

}
