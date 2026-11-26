import {Injectable, NotFoundException} from '@nestjs/common';
import {Post} from '../domain/post.entity';
import type {PostModelType} from '../domain/post.entity';
import {InjectModel} from '@nestjs/mongoose';
import {UserViewDto} from '../../user-accounts/api/view-dto/users.view-dto';
import {PostsViewDto} from '../api/view-dto/posts.view-dto';
import {GetUsersQueryParams} from '../../user-accounts/api/input-dto/get-users-query-params.input-dto';
import {PaginatedViewDto} from '../../../core/dto/base.paginated.view-dto';
import type {QueryFilter} from 'mongoose';
import {User} from '../../user-accounts/domain/user.entity';
import {GetPostsQueryParams} from '../api/input-dto/get-posts-query-params.input-dto';

@Injectable()
export class PostsQueryRepository {
    constructor(
        @InjectModel(Post.name)
        private PostModel: PostModelType
    ) {}
    
    async getByIdOrNotFoundFail(id: string): Promise<PostsViewDto> {
        const post = await this.PostModel.findOne({
            _id: id,
            deletedAt: null,
        });
        
        if (!post) {
            throw new NotFoundException('user not found');
        }
        
        return PostsViewDto.mapToView(post);
    }
    
    async getAll(
        query: GetPostsQueryParams,
    ): Promise<PaginatedViewDto<PostsViewDto[]>> {
        const filter: QueryFilter<Post> = {
            deletedAt: null,
        };
        
        const posts = await this.PostModel.find(filter)
            .sort({ [query.sortBy]: query.sortDirection })
            .skip(query.calculateSkip())
            .limit(query.pageSize);
        
        const totalCount = await this.PostModel.countDocuments(filter);
        
        const items = posts.map(PostsViewDto.mapToView);
        
        return PaginatedViewDto.mapToView({
            items,
            totalCount,
            page: query.pageNumber,
            size: query.pageSize,
        });
    }
    
}
