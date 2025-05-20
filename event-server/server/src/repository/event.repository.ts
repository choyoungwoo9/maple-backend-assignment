import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDomain, EventStatus } from 'src/domain/event/event.domain';
import { EventDocument, EventSchemaInfo } from './schema/event.schema';

@Injectable()
export class EventRepository {
  constructor(
    @InjectModel(EventSchemaInfo.name)
    private eventModel: Model<EventSchemaInfo>,
  ) {}

  async create(event: EventDomain): Promise<EventDomain> {
    const documentData = {
      id: event.id,
      description: event.description,
      startAt: event.startAt,
      endAt: event.endAt,
      status: event.status,
      conditionList: event.conditionList,
      rewardList: event.rewardList,
    };
    const createdEvent = new this.eventModel(documentData);
    const savedDocument = await createdEvent.save();
    return this.eventDocumentToDomain(savedDocument);
  }

  private eventDocumentToDomain(document: EventDocument): EventDomain {
    return new EventDomain(
      document.id,
      document.description,
      document.startAt,
      document.endAt,
      document.status as EventStatus,
      document.conditionList,
      document.rewardList,
    );
  }
}
