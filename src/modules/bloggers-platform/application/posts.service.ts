import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Post} from '../domain/post.entity';
import type {PostModelType} from '../domain/post.entity';
import {CreatePostDto, UpdatePostDto} from '../dto/create-post.dto';
import {BlogsRepository} from '../infrastructure/blogs.repository';
import {PostsRepository} from '../infrastructure/posts.repository';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name)
        private PostModel: PostModelType,
        private blogsRepository: BlogsRepository,
        private postRepository: PostsRepository
    ) {}
    
    async createPost(dto: CreatePostDto): Promise<string> {
        
        const blog = await this.blogsRepository.findOrNotFoundFail(dto.blogId)
        
        const post = this.PostModel.createInstance({
            title: dto.title,
            content: dto.content,
            shortDescription: dto.shortDescription,
            blogId: blog._id,
            blogName: blog.name
        })
        
        await this.postRepository.save(post);
        return post._id.toString()
    }
    
    async updatePost(id: string, dto: UpdatePostDto): Promise<string> {
        const post = await this.postRepository.findOrNotFoundFail(id);
        const blog = await this.blogsRepository.findOrNotFoundFail(dto.blogId);
        post.update({
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: blog._id,
            blogName: blog.name,
        })
        await this.blogsRepository.save(blog);
        return blog._id.toString();
    }
    
    async deletePost(id: string) {
        const post = await this.postRepository.findOrNotFoundFail(id);
        
        post.makeDeleted();
        
        await this.postRepository.save(post);
    }
    
    
}
