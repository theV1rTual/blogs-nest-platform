import { Injectable } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Blog} from '../domain/blog.entity';
import type {BlogModelType} from '../domain/blog.entity';
import {BlogsRepository} from '../infrastructure/blogs.repository';
import {CreateBlogDto, UpdateBlogDto} from '../dto/create-blog.dto';
import type {UpdateUserDto} from '../../user-accounts/dto/create-user.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    private blogsRepository: BlogsRepository
  ) {}
  async createBlog(dto: CreateBlogDto): Promise<string> {
      const blog = this.BlogModel.createInstance({
          name: dto.name,
          websiteUrl: dto.websiteUrl,
          description: dto.description
      })
      
      await this.blogsRepository.save(blog)
      
      return blog._id.toString()
  }
    
    async updateBlog(id: string, dto: UpdateBlogDto): Promise<string> {
        const blog = await this.blogsRepository.findOrNotFoundFail(id);
        blog.update(dto);
        
        await this.blogsRepository.save(blog);
        
        return blog._id.toString();
    }
    
    async deleteBlog(id: string) {
        const blog = await this.blogsRepository.findOrNotFoundFail(id);

        blog.makeDeleted();
        
        await this.blogsRepository.save(blog);
    }
  
}
