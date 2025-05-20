import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = EventSchemaInfo & Document;

@Schema()
export class EventSchemaInfo {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  startAt: Date;

  @Prop({ required: true })
  endAt: Date;

  @Prop({ required: true })
  status: string;

  @Prop({ type: [{ type: Object }], required: true })
  conditionList: any[];

  @Prop({ type: [{ type: Object }], required: true })
  rewardList: any[];

  @Prop({ required: true })
  creatorExposedId: string;
}

export const EventSchema = SchemaFactory.createForClass(EventSchemaInfo);
