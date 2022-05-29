import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Game } from 'src/entities/game.entity';
import { Topic } from 'src/entities/topic.entity';
import { User } from 'src/entities/user.entity';
import { getRepository } from 'typeorm';
import { CreateTopicDto } from '../dto/create-topic.dto';
import { UpdateTopicDto } from '../dto/update-topic.dto';

const jwt = require('jsonwebtoken');

@Injectable()
export class TopicsService {
  async create(createTopicDto: CreateTopicDto, token: string) {
    try {
      const topicRepository = getRepository(Topic);
      const gameRepository = getRepository(Game);
      const userRepository = getRepository(User);

      const topic = topicRepository.create();

      topic.title = createTopicDto.title;
      topic.description = createTopicDto.description;
      topic.content = createTopicDto.content;

      const userData = jwt.verify(token, process.env.JWTSecret);
      const user = await userRepository.findOne(userData.id);
      const game = await gameRepository.findOne(createTopicDto.game_id);

      if (!user) throw new BadRequestException('User not found.');
      if (!game) throw new BadRequestException('Game not found.');
      
      topic.user = user;
      topic.game = game;
      return await topicRepository.save(topic);
    } catch (err) {
      throw new ForbiddenException(err);
    }
  }

  async findAll() {
    try {
      const topicRepository = getRepository(Topic);
      return await topicRepository.find();
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} topic`;
  }

  update(id: number, updateTopicDto: UpdateTopicDto) {
    return `This action updates a #${id} topic`;
  }

  remove(id: number) {
    return `This action removes a #${id} topic`;
  }
}
