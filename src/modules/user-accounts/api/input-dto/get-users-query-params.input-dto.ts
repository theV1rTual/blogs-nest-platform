import { UsersSortBy } from './users-sort-by';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
export class GetUsersQueryParams extends BaseQueryParams {
  @IsEnum(UsersSortBy)
  sortBy = UsersSortBy.CreatedAt;
  @IsOptional()
  @IsString()
  searchLoginTerm: string | null = null;
  @IsOptional()
  @IsString()
  searchEmailTerm: string | null = null;
}
