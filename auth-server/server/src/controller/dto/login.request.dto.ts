import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
	@ApiProperty({
		description: '사용자 아이디',
		example: 'id123',
		minLength: 4,
		maxLength: 16,
	})
	@IsNotEmpty()
	@IsString()
	@Length(4, 16)
	id: string;

	@ApiProperty({
		description: '사용자 비밀번호',
		example: 'password123',
		minLength: 4,
		maxLength: 16,
	})
	@IsNotEmpty()
	@IsString()
	@Length(4, 16)
	password: string;
}
