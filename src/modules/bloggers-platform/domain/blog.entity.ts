import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Model, Types} from 'mongoose';
import {CreateBlogDomainDto} from './dto/create-blog.domain.dto';
import type {UpdateUserDto} from '../../user-accounts/dto/create-user.dto';
import {UpdateBlogDto} from '../dto/create-blog.dto';

@Schema({timestamps: true})
export class Blog {
    declare _id: Types.ObjectId;
    
    @Prop({type: String, required: true})
    name!: string
    
    @Prop({type: String, required: true})
    description!:string
    
    @Prop({type: String, required: true})
    websiteUrl!:string
    
    createdAt!: Date
    
    @Prop({type: Boolean, required: true, default: false})
    isMembership!:boolean
    
    @Prop({ type: Date, default: null })
    deletedAt!: Date | null;
    
    get id() {
        return this._id.toString();
    }
    
    static createInstance(this:BlogModelType, dto: CreateBlogDomainDto):BlogDocument {
        const blog = new this();
        blog.name = dto.name;
        blog.description = dto.description;
        blog.websiteUrl = dto.websiteUrl
        
        return blog as BlogDocument
    }
    
    makeDeleted() {
        if (this.deletedAt !== null) {
            throw new Error('Entity already deleted');
        }
        this.deletedAt = new Date();
    }
    
    update(dto: UpdateBlogDto) {
        if (dto.name !== this.name) {
            this.name = dto.name;
        }
        
        if (dto.description !== this.description) {
            this.description = dto.description
        }
        
        if (dto.websiteUrl !== this.websiteUrl) {
            this.websiteUrl = dto.websiteUrl
        }
    }
    
}

export const BlogSchema = SchemaFactory.createForClass(Blog)
BlogSchema.loadClass(Blog);
export type BlogDocument = HydratedDocument<Blog>;
export type BlogModelType = Model<Blog> & typeof Blog;
