import { IsNotEmpty, IsString } from 'class-validator';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';

export class GetCommentsQueryParams extends BaseQueryParams {
  @IsString()
  @IsNotEmpty()
  sortBy = 'createdAt';
}
