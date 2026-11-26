import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query} from '@nestjs/common';
import {ApiParam} from '@nestjs/swagger';
import {PostsRepository} from '../infrastructure/posts.repository';
import {PostsQueryRepository} from '../infrastructure/posts.query-repository';
import {PostsViewDto} from './view-dto/posts.view-dto';
import {PaginatedViewDto} from '../../../core/dto/base.paginated.view-dto';
import {GetPostsQueryParams} from './input-dto/get-posts-query-params.input-dto';
import {PostsService} from '../application/posts.service';
import {CreatePostDto} from '../dto/create-post.dto';
import {UpdatePostsQueryDto} from './input-dto/update-posts-query-params.input-dto';

@Controller('posts')
export class PostsController {
    constructor(
        private postRepository: PostsRepository,
        private postQueryRepository: PostsQueryRepository,
        private postsService: PostsService
    ) {}
    
    @ApiParam({ name: 'id' })
    @Get(':id')
    async getById(@Param('id') id: string): Promise<PostsViewDto> {
        return this.postQueryRepository.getByIdOrNotFoundFail(id);
    }
    
    @Get()
    async getAll(
        @Query() query: GetPostsQueryParams,
    ): Promise<PaginatedViewDto<PostsViewDto[]>> {
        return this.postQueryRepository.getAll(query);
    }
    
    @Post()
    async createPost(@Body() body: CreatePostDto): Promise<PostsViewDto> {
        const postId = await this.postsService.createPost(body);
        
        return this.postQueryRepository.getByIdOrNotFoundFail(postId)
    }
    
    @Put(':id')
    async updatePost(
        @Param('id') id: string,
        @Body() body: UpdatePostsQueryDto,
    ): Promise<PostsViewDto> {
        const userId = await this.postsService.updatePost(id, body);
        
        return this.postQueryRepository.getByIdOrNotFoundFail(userId);
    }
    
    @ApiParam({ name: 'id' })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePost(@Param('id') id: string): Promise<void> {
        return this.postsService.deletePost(id);
    }
}
