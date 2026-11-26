import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {NewestLike, NewestLikeSchema} from './newestLikesInfo.schema';

@Schema({
    _id: false
})
export class ExtendedLikesInfo {
    @Prop({ type: Number, default: 0 })
    likesCount!: number;
    
    @Prop({ type: Number, default: 0 })
    dislikesCount!: number;
    
    @Prop({ type: String, default: 'None' })
    myStatus!: string;
    
    @Prop({ type: [NewestLikeSchema], default: [] })
    newestLikes!: NewestLike[];
}

export const ExtendedLikesInfoSchema =
    SchemaFactory.createForClass(ExtendedLikesInfo);
