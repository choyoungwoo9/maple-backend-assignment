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

  async findInactiveAndOngoingEvents(
    referenceTime: Date,
  ): Promise<EventDomain[]> {
    const docs = await this.eventModel.find({
      status: 'INACTIVE',
      startAt: { $lte: referenceTime },
      endAt: { $gt: referenceTime },
    });
    return docs.map((doc) => this.eventDocumentToDomain(doc));
  }

  async findActiveAndEndedEvents(referenceTime: Date): Promise<EventDomain[]> {
    const docs = await this.eventModel.find({
      status: 'ACTIVE',
      endAt: { $lte: referenceTime },
    });
    return docs.map((doc) => this.eventDocumentToDomain(doc));
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await this.eventModel.updateOne({ id }, { status });
  }

  async findAllSummary(): Promise<{ id: string; description: string }[]> {
    const docs = await this.eventModel.find(
      {},
      { id: 1, description: 1, _id: 0 },
    );
    return docs.map((doc) => ({
      id: doc.id,
      description: doc.description,
    }));
  }

  async findById(id: string): Promise<EventDomain | null> {
    const doc = await this.eventModel.findOne({ id });
    return doc ? this.eventDocumentToDomain(doc) : null;
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
      document.creatorExposedId,
    );
  }
}
