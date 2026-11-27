import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query} from '@nestjs/common';
import {PaginatedViewDto} from '../../../core/dto/base.paginated.view-dto';
import {BlogsQueryRepository} from '../infrastructure/blogs.query-repository';
import {BlogsService} from '../application/blogs.service';
import {GetBlogsQueryParams} from './input-dto/get-blogs-query-params.input-dto';
import {BlogsViewDto} from './view-dto/blogs.view-dto';
import {CreateBlogDomainDto} from '../domain/dto/create-blog.domain.dto';
import {ApiParam} from '@nestjs/swagger';
import {UpdateBlogsQueryDto} from './input-dto/update-blogs-query-params.input-dto';
import {PostsViewDto} from './view-dto/posts.view-dto';
import {PostsQueryRepository} from '../infrastructure/posts.query-repository';
import {PostsService} from '../application/posts.service';
import {GetPostsQueryParams} from './input-dto/get-posts-query-params.input-dto';
import {CreatePostDto} from '../dto/create-post.dto';

@Controller('blogs')
export class BlogsController {
    constructor(
        private blogQueryRepository: BlogsQueryRepository,
        private postQueryRepository: PostsQueryRepository,
        
        private blogService: BlogsService,
        private postService: PostsService
    ) {}
    
    @ApiParam({ name: 'id' })
    @Get(':id')
    async getById(@Param('id') id: string): Promise<BlogsViewDto> {
        return this.blogQueryRepository.getByIdOrNotFoundFail(id);
    }
    
    @ApiParam({name: 'id'})
    @Get(':id/posts')
    async getPostByBlogId(@Param('id') id: string, @Query() query: GetPostsQueryParams): Promise<PaginatedViewDto<PostsViewDto[]>> {
        await this.blogQueryRepository.getByIdOrNotFoundFail(id);
        
        return this.postQueryRepository.getAll(query, id)
    }
    
    @ApiParam({name: 'id'})
    @Post(':id/posts')
    async createPostForBlog(@Param('id') id: string, @Body() body: Omit<CreatePostDto, 'blogId'>):Promise<PostsViewDto>{
        await this.blogQueryRepository.getByIdOrNotFoundFail(id);
        
        const postId = await this.postService.createPost({
            blogId: id,
            shortDescription: body.shortDescription,
            content: body.content,
            title: body.title
        })
        
        return this.postQueryRepository.getByIdOrNotFoundFail(postId)
        
    }
    
    @Get()
    async getAll(
        @Query() query: GetBlogsQueryParams,
    ): Promise<PaginatedViewDto<BlogsViewDto[]>> {
        return this.blogQueryRepository.getAll(query);
    }
    
    @Post()
    async createBlog(@Body() body: CreateBlogDomainDto): Promise<BlogsViewDto> {
        const blogId = await this.blogService.createBlog(body);
        
        return this.blogQueryRepository.getByIdOrNotFoundFail(blogId)
    }
    
    @Put(':id')
    async updateBlog(
        @Param('id') id: string,
        @Body() body: UpdateBlogsQueryDto,
    ): Promise<BlogsViewDto> {
        const userId = await this.blogService.updateBlog(id, body);
        
        return this.blogQueryRepository.getByIdOrNotFoundFail(userId);
    }
    
    @ApiParam({ name: 'id' })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBlog(@Param('id') id: string): Promise<void> {
        return this.blogService.deleteBlog(id);
    }
    
}
