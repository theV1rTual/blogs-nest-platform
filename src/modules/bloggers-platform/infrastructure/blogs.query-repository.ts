import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Blog} from '../domain/blog.entity';
import type {BlogModelType} from '../domain/blog.entity';
import {PaginatedViewDto} from '../../../core/dto/base.paginated.view-dto';
import {QueryFilter} from 'mongoose';
import {GetBlogsQueryParams} from '../api/input-dto/get-blogs-query-params.input-dto';
import {BlogsViewDto} from '../api/view-dto/blogs.view-dto';
import {UserViewDto} from '../../user-accounts/api/view-dto/users.view-dto';

@Injectable()
export class BlogsQueryRepository {
    constructor(
        @InjectModel(Blog.name)
        private BlogModel: BlogModelType
    ) {}
    
    async getByIdOrNotFoundFail(id: string): Promise<BlogsViewDto> {
        const blog = await this.BlogModel.findOne({
            _id: id,
            deletedAt: null,
        });
        
        if (!blog) {
            throw new NotFoundException('user not found');
        }
        
        return BlogsViewDto.mapToView(blog);
    }
    
    async getAll(query: GetBlogsQueryParams): Promise<PaginatedViewDto<BlogsViewDto[]>> {
        const filter: QueryFilter<Blog> = {
            deletedAt: null
        }
        
        if (query.searchNameTerm) {
            filter.$or = filter.$or || [];
            filter.$or.push({
                name: { $regex: query.searchNameTerm, $options: 'i' },
            });
        }
        
        const blogs = await this.BlogModel.find(filter)
            .sort({ [query.sortBy]: query.sortDirection })
            .skip(query.calculateSkip())
            .limit(query.pageSize);
        
        const totalCount = await this.BlogModel.countDocuments(filter);
        
        const items = blogs.map(BlogsViewDto.mapToView);
        
        return PaginatedViewDto.mapToView({
            items,
            totalCount,
            page: query.pageNumber,
            size: query.pageSize
        })
    }
    
}
