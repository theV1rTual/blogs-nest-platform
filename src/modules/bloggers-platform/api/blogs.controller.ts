import {Body, Controller, Get, Param, Post, Put, Query} from '@nestjs/common';
import {GetUsersQueryParams} from '../../user-accounts/api/input-dto/get-users-query-params.input-dto';
import {PaginatedViewDto} from '../../../core/dto/base.paginated.view-dto';
import {UserViewDto} from '../../user-accounts/api/view-dto/users.view-dto';
import {BlogsQueryRepository} from '../infrastructure/blogs.query-repository';
import {BlogsService} from '../blogs.service';
import {GetBlogsQueryParams} from './input-dto/get-blogs-query-params.input-dto';
import {BlogsViewDto} from './view-dto/blogs.view-dto';
import {CreateBlogDomainDto} from '../domain/dto/create-blog.domain.dto';
import {ApiParam} from '@nestjs/swagger';
import {UpdateUserInputDto} from '../../user-accounts/api/input-dto/update-user.input-dto';
import {UpdateBlogsQueryDto} from './input-dto/update-blogs-query-params.input-dto';

@Controller('blogs')
export class BlogsController {
    constructor(
        private blogQueryRepository: BlogsQueryRepository,
        private blogService: BlogsService
    ) {}
    
    @ApiParam({ name: 'id' })
    @Get(':id')
    async getById(@Param('id') id: string): Promise<BlogsViewDto> {
        return this.blogQueryRepository.getByIdOrNotFoundFail(id);
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
    
    
}
