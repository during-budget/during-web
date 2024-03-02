import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
class UserFrield {
  @Prop({ required: true, ref: 'User' })
  id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  uuid: string;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  userName: string;

  @Prop()
  password: string;

  @Prop()
  price: number;

  @Prop()
  friend: UserFrield;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  createdAt: Date;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
