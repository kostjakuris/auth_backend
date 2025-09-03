import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({timestamps: true})
export class Message {
  @Prop()
  message: string;
  
  @Prop()
  username: string;
  
  @Prop()
  userId: string;
  
  @Prop()
  type: string;
  
  @Prop({nullable: true})
  fullPath: string;
  
  @Prop({default: false})
  isUpdated: boolean;
  
  @Prop()
  roomId: number;
  
}

export const MessageSchema = SchemaFactory.createForClass(Message);
