import {Module} from '@nestjs/common';
import { BlogsService } from './application/blogs.service';
import {MongooseModule} from '@nestjs/mongoose';
import {Blog, BlogSchema} from './domain/blog.entity';
import {BlogsController} from './api/blogs.controller';
import {BlogsRepository} from './infrastructure/blogs.repository';
import {BlogsQueryRepository} from './infrastructure/blogs.query-repository';
import {PostsQueryRepository} from './infrastructure/posts.query-repository';
import {PostsRepository} from './infrastructure/posts.repository';
import {PostsService} from './application/posts.service';
import {Post, PostSchema} from './domain/post.entity';
import {PostsController} from './api/posts.controller';
import {Comment, CommentSchema} from './domain/comment.entity';
import {CommentsController} from './api/comments.controller';
import {CommentsQueryRepository} from './infrastructure/comments.query-repository';

@Module({
  imports: [
      MongooseModule.forFeature([
          {name: Blog.name, schema: BlogSchema},
          { name: Post.name, schema: PostSchema },
          { name: Comment.name, schema: CommentSchema },
      ])
  ],
  controllers: [
      BlogsController,
      PostsController,
      CommentsController,
  ],
  providers: [
      BlogsService,
      PostsService,
      BlogsRepository,
      PostsRepository,
      BlogsQueryRepository,
      PostsQueryRepository,
      CommentsQueryRepository,
  ],
})
export class BloggersPlatformModule {}
