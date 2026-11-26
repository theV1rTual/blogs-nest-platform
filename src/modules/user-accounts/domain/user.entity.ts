import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument, Model, Types } from 'mongoose';
import type { UpdateUserDto } from '../dto/create-user.dto';
import type { CreateUserDomainDto } from './dto/create-user.domain.dto';
import { Name, NameSchema } from './name.schema';

@Schema({ timestamps: true })
export class User {
  declare _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  login!: string;

  @Prop({ type: String, required: true })
  passwordHash!: string;

  @Prop({ type: String, minlength: 5, required: true })
  email!: string;

  @Prop({ type: Boolean, required: true, default: false })
  isEmailConfirmed!: boolean;
  @Prop({ type: NameSchema })
  name!: Name;

  createdAt!: Date;
  updatedAt!: Date;

  @Prop({ type: Date, default: null })
  deletedAt!: Date | null;

  get id() {
    return this._id.toString();
  }

  static createInstance(
    this: UserModelType,
    dto: CreateUserDomainDto,
  ): UserDocument {
    const user = new this();
    user.email = dto.email;
    user.passwordHash = dto.passwordHash;
    user.login = dto.login;
    user.isEmailConfirmed = false;

    user.name = {
      firstName: 'firstName xxx',
      lastName: 'lastName yyy',
    };

    return user as UserDocument;
  }

  makeDeleted() {
    if (this.deletedAt !== null) {
      throw new Error('Entity already deleted');
    }
    this.deletedAt = new Date();
  }

  update(dto: UpdateUserDto) {
    if (dto.email !== this.email) {
      this.isEmailConfirmed = false;
      this.email = dto.email;
    }
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.loadClass(User);
export type UserDocument = HydratedDocument<User>;
export type UserModelType = Model<User> & typeof User;
