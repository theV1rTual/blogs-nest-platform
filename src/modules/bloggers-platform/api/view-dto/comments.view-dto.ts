import type { CommentDocument } from '../../domain/comment.entity';

export class CommentatorInfoViewDto {
  userId!: string;
  userLogin!: string;
}

export class CommentLikesInfoViewDto {
  likesCount!: number;
  dislikesCount!: number;
  myStatus!: string;
}

export class CommentsViewDto {
  id!: string;
  content!: string;
  commentatorInfo!: CommentatorInfoViewDto;
  createdAt!: Date;
  likesInfo!: CommentLikesInfoViewDto;

  static mapToView(comment: CommentDocument): CommentsViewDto {
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId.toString(),
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: comment.likesInfo?.likesCount ?? 0,
        dislikesCount: comment.likesInfo?.dislikesCount ?? 0,
        myStatus: 'None',
      },
    };
  }
}
