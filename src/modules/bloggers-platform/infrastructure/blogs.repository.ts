import {Injectable, NotFoundException} from '@nestjs/common';
import {Blog} from '../domain/blog.entity';
import type { BlogDocument, BlogModelType } from '../domain/blog.entity';
import {InjectModel} from '@nestjs/mongoose';
import {UpdatePostDto} from '../dto/create-post.dto';

@Injectable()
export class BlogsRepository {
    constructor(
        @InjectModel(Blog.name) private BlogModel: BlogModelType
    ) {}
    
    async findById(id: string): Promise<BlogDocument | null> {
        return this.BlogModel.findOne({
            _id: id,
            deletedAt: null,
        });
    }
    
    async findOrNotFoundFail(id: string): Promise<BlogDocument> {
        const blog = await this.findById(id);
        
        if (!blog) {
            throw new NotFoundException('user not found');
        }
        
        return blog;
    }
    
    async save(blog:BlogDocument) {
        await blog.save()
    }
}
