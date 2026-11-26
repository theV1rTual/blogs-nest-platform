import {UpdatePostDto} from '../../dto/create-post.dto';
import {IsNotEmpty, IsString} from 'class-validator';

export class UpdatePostsQueryDto implements  UpdatePostDto {
    @IsString()
    @IsNotEmpty()
    title!: string
    @IsString()
    @IsNotEmpty()
    shortDescription!: string
    @IsString()
    @IsNotEmpty()
    content!: string
    @IsString()
    @IsNotEmpty()
    blogId!: string
}
