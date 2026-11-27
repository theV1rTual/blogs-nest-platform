import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Post, PostDocument} from '../domain/post.entity';
import type {PostModelType} from '../domain/post.entity';
import type {UserDocument} from '../../user-accounts/domain/user.entity';

@Injectable()
export class PostsRepository {
    constructor(@InjectModel(Post.name) private PostModel: PostModelType) {}
    
    async findById(id: string): Promise<PostDocument | null> {
        return this.PostModel.findOne({
            _id: id,
            deletedAt: null
        })
    }
    
    async findByBlogId(id: string): Promise<PostDocument[]> {
        return this.PostModel.find({
            blogId: id
        })
    }
    
    async save(post: PostDocument) {
        await post.save();
    }
    
    async findOrNotFoundFail(id: string): Promise<PostDocument> {
        const post = await this.findById(id);
        
        if (!post) {
            throw new NotFoundException('post not found');
        }
        
        return post;
    }
}
