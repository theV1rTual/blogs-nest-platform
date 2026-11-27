import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isObjectIdOrHexString } from 'mongoose';
import type { QueryFilter } from 'mongoose';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { GetCommentsQueryParams } from '../api/input-dto/get-comments-query-params.input-dto';
import { CommentsViewDto } from '../api/view-dto/comments.view-dto';
import { Comment } from '../domain/comment.entity';
import type { CommentModelType } from '../domain/comment.entity';
import { Post } from '../domain/post.entity';
import type { PostModelType } from '../domain/post.entity';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: CommentModelType,
    @InjectModel(Post.name) private readonly postModel: PostModelType,
  ) {}

  async getByIdOrNotFoundFail(id: string): Promise<CommentsViewDto> {
    if (!isObjectIdOrHexString(id)) {
      throw new NotFoundException('comment not found');
    }

    const comment = await this.commentModel.findOne({
      _id: id,
      deletedAt: null,
    });
    if (!comment) {
      throw new NotFoundException('comment not found');
    }

    return CommentsViewDto.mapToView(comment);
  }

  async getByPostId(
    postId: string,
    query: GetCommentsQueryParams,
  ): Promise<PaginatedViewDto<CommentsViewDto[]>> {
    if (
      !isObjectIdOrHexString(postId) ||
      !(await this.postModel.exists({ _id: postId, deletedAt: null }))
    ) {
      throw new NotFoundException('post not found');
    }

    const filter: QueryFilter<Comment> = { postId, deletedAt: null };
    const comments = await this.commentModel
      .find(filter)
      .sort({ [query.sortBy]: query.sortDirection, _id: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);
    const totalCount = await this.commentModel.countDocuments(filter);

    return PaginatedViewDto.mapToView({
      items: comments.map(CommentsViewDto.mapToView),
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }
}
