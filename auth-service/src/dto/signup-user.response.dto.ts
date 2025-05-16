import { ApiProperty } from '@nestjs/swagger';

export class SignupUserResponseDto {
	@ApiProperty({
		description: '액세스 토큰',
		example: 'JWTAccessToken',
	})
	accessToken: string;
}
