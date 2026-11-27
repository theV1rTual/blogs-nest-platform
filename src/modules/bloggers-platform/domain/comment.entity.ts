import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import type { HydratedDocument, Model, Types } from 'mongoose';

@Schema({ _id: false })
export class CommentatorInfo {
  @Prop({ type: String, required: true })
  userId!: string;

  @Prop({ type: String, required: true })
  userLogin!: string;
}

const CommentatorInfoSchema = SchemaFactory.createForClass(CommentatorInfo);

@Schema({ _id: false })
export class CommentLikesInfo {
  @Prop({ type: Number, default: 0 })
  likesCount!: number;

  @Prop({ type: Number, default: 0 })
  dislikesCount!: number;
}

const CommentLikesInfoSchema = SchemaFactory.createForClass(CommentLikesInfo);

@Schema({ timestamps: true })
export class Comment {
  declare _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  content!: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'Post' })
  postId!: Types.ObjectId;

  @Prop({ type: CommentatorInfoSchema, required: true })
  commentatorInfo!: CommentatorInfo;

  @Prop({ type: CommentLikesInfoSchema, default: () => ({}) })
  likesInfo!: CommentLikesInfo;

  @Prop({ type: Date, default: null })
  deletedAt!: Date | null;

  createdAt!: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
export type CommentDocument = HydratedDocument<Comment>;
export type CommentModelType = Model<Comment>;
