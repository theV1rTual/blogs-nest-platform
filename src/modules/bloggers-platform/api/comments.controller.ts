import { Controller, Get, Param } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { CommentsQueryRepository } from '../infrastructure/comments.query-repository';
import { CommentsViewDto } from './view-dto/comments.view-dto';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @ApiParam({ name: 'id' })
  @Get(':id')
  getById(@Param('id') id: string): Promise<CommentsViewDto> {
    return this.commentsQueryRepository.getByIdOrNotFoundFail(id);
  }
}
