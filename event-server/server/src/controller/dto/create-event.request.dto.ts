import { IsOptional, ValidateNested, IsArray } from 'class-validator';
import { RewardControllerDto } from './reward.controller.dto';
import { Type } from 'class-transformer';
import { EventControllerDto } from './event.controller.dto';

export class CreateEventRequestDto {
  @ValidateNested()
  @Type(() => EventControllerDto)
  readonly event: EventControllerDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RewardControllerDto)
  readonly rewards?: RewardControllerDto[];
}
