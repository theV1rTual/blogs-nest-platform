import {UpdateBlogDto} from '../../dto/create-blog.dto';
import {IsNotEmpty, IsString} from 'class-validator';

export class UpdateBlogsQueryDto implements UpdateBlogDto {
    @IsString()
    @IsNotEmpty()
    name!: string;
    @IsString()
    @IsNotEmpty()
    description!: string;
    @IsString()
    @IsNotEmpty()
    websiteUrl!: string;
}
