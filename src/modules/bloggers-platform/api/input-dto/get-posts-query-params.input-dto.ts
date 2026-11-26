import {BaseQueryParams} from '../../../../core/dto/base.query-params.input-dto';
import {IsEnum} from 'class-validator';
import {UsersSortBy} from '../../../user-accounts/api/input-dto/users-sort-by';

export class GetPostsQueryParams extends BaseQueryParams {
    @IsEnum(UsersSortBy)
    sortBy = UsersSortBy.CreatedAt;
}
