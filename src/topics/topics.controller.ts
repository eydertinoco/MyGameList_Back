import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { CreateTopicDTO } from '../dto/create-topic.dto';
import { UpdateTopicDTO } from '../dto/update-topic.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('topics')
@ApiBearerAuth()
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post()
  create(@Body() createTopicDto: CreateTopicDTO, @Request() req) {

    const auth = req.headers['authorization'];
    if ( !auth ) return;
    
    const token = auth.split(' ')[1];

    return this.topicsService.create(createTopicDto, token);
  }

  @Get()
  findAll() {
    return this.topicsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDTO) {
    return this.topicsService.update(id, updateTopicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.topicsService.remove(id);
  }
}
