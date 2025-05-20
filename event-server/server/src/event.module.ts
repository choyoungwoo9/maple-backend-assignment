import { Module } from '@nestjs/common';
import { EventController } from './controller/event.controller';
import { EventService } from './service/event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.EVENT_MONGODB_URI, {
      dbName: process.env.EVENT_MONGODB_DB_NAME,
    }),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
