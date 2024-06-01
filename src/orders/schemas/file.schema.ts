import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileDetailsDocument = FileDetails & Document;

@Schema()
export class FileDetails {
  @Prop()
  name: string;

  @Prop()
  size: number;

  @Prop()
  path: string;
}

export const FileDetailsSchema = SchemaFactory.createForClass(FileDetails);
