import { Module } from '@nestjs/common';
import { EventController } from './controller/event.controller';
import { EventService } from './service/event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EventSchema, EventSchemaInfo } from './repository/schema/event.schema';
import { EventRepository } from './repository/event.repository';
import { ScheduleModule } from '@nestjs/schedule';
import { EventStatusScheduler } from './service/event-status.scheduler';
import { AuthService } from './service/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

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
    JwtModule.register({
      secret: process.env.AUTH_SERVER_JWT_SECRET,
    }),
  ],
  controllers: [EventController],
  providers: [EventService, EventRepository, EventStatusScheduler, AuthService],
  exports: [EventRepository],
})
export class EventModule {}
