import { Module } from '@nestjs/common';
import { EventController } from './controller/event.controller';
import { EventService } from './service/event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EventSchema, EventSchemaInfo } from './repository/schema/event.schema';
import { EventRepository } from './repository/event.repository';
import { ScheduleModule } from '@nestjs/schedule';
import { EventStatusScheduler } from './service/event-status.scheduler';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.EVENT_MONGODB_URI, {
      dbName: process.env.EVENT_MONGODB_DB_NAME,
    }),
    MongooseModule.forFeature([
      { name: EventSchemaInfo.name, schema: EventSchema },
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [EventController],
  providers: [EventService, EventRepository, EventStatusScheduler],
  exports: [EventRepository],
})
export class EventModule {}
