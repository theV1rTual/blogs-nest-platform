import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import type {HydratedDocument, Model, Types} from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import {ExtendedLikesInfo, ExtendedLikesInfoSchema} from './extendedLikesInfo.schema';
import {UserDocument} from '../../user-accounts/domain/user.entity';
import {CreatePostDomainDto} from './dto/create-post.domain.dto';
import {UpdatePostDto} from '../dto/create-post.dto';


@Schema({timestamps: true})
export class Post {
    declare _id: Types.ObjectId;
    
    @Prop({ type: String, required: true })
    title!: string;
    
    @Prop({ type: String, required: true })
    shortDescription!: string;
    
    @Prop({ type: String, required: true })
    content!: string;
    
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        required: true,
        ref: 'Blog',
    })
    blogId!: Types.ObjectId;
    
    @Prop({ type: String, required: true })
    blogName!: string;
    
    createdAt!: Date
    @Prop({
        type: ExtendedLikesInfoSchema,
        required: true,
        default: () => ({}),
    })
    extendedLikesInfo!: ExtendedLikesInfo;
    
    @Prop({ type: Date, default: null })
    deletedAt!: Date | null;
    
    get id() {
        return this._id.toString();
    }
    
    static createInstance(
        this: PostModelType,
        dto: CreatePostDomainDto,
    ): PostDocument {
        const post = new this();
        post.title = dto.title;
        post.shortDescription = dto.shortDescription;
        post.content = dto.content;
        post.blogId = dto.blogId
        post.blogName = dto.blogName
        post.extendedLikesInfo = {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: 'None',
            newestLikes: []
        }
        return post as PostDocument
    }
    
    makeDeleted() {
        if (this.deletedAt !== null) {
            throw new Error('Entity already deleted');
        }
        this.deletedAt = new Date();
    }
    
    update(dto: {
        title: string;
        shortDescription: string;
        content: string;
        blogId: Types.ObjectId;
        blogName: string;
    }) {
        this.title = dto.title;
        this.shortDescription = dto.shortDescription;
        this.content = dto.content;
        this.blogId = dto.blogId;
        this.blogName = dto.blogName;
    }
}

export const PostSchema = SchemaFactory.createForClass(Post)
PostSchema.loadClass(Post)
export type PostDocument = HydratedDocument<Post>
export type PostModelType = Model<Post> & typeof Post
