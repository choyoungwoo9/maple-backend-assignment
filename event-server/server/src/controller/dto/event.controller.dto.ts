import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';

export class ConditionDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsObject()
  params: Record<string, any>;
}

export class EventControllerDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConditionDto)
  readonly conditions: ConditionDto[];

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  readonly startAt: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  readonly endAt: Date;

  @IsString()
  @IsNotEmpty()
  readonly description: string;
}
