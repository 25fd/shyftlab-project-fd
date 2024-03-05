import { Controller } from '@nestjs/common';
import { ResultService } from './result.service';
import { Get, Post, Param, Delete, Body } from '@nestjs/common';
import { ResultDto } from './result.dto';

@Controller('results')
export class ResultController {
  constructor(private resultService: ResultService) {}

  @Get()
  async findAll() {
    return this.resultService.findAll();
  }

  @Post()
  async create(@Body() result: ResultDto) {
    return this.resultService.create(result);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.resultService.delete(id);
  }
}
