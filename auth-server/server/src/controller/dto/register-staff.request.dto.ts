import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { Role } from 'src/domain/account.domain';

export class RegisterStaffRequestDto {
	@ApiProperty({
		description: '스태프 아이디',
		example: 'staff123',
		minLength: 4,
		maxLength: 16,
	})
	@IsNotEmpty()
	@IsString()
	@Length(4, 16)
	id: string;

	@ApiProperty({
		description: '스태프 비밀번호',
		example: 'password123',
		minLength: 4,
		maxLength: 16,
	})
	@IsNotEmpty()
	@IsString()
	@Length(4, 16)
	password: string;

	@ApiProperty({
		description: '스태프 권한',
		enum: [Role.Operator, Role.Auditor, Role.Admin],
		example: Role.Operator,
	})
	@IsNotEmpty()
	@IsEnum([Role.Operator, Role.Auditor, Role.Admin])
	role: Role.Operator | Role.Auditor | Role.Admin;
}
