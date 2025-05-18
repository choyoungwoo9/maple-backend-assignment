import { Body, Controller, Post, ConflictException } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignupUserRequestDto } from './dto/signup-user.request.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthServiceIdDuplicatedException } from '../service/exception/auth.service.exception';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('users/signup')
	@ApiOperation({ summary: '회원가입' })
	@ApiResponse({
		status: 201,
		description: '회원가입 성공',
	})
	@ApiResponse({ status: 400, description: '요청 Body 형식 오류' })
	@ApiResponse({ status: 401, description: 'id 중복' })
	async signupUser(@Body() dto: SignupUserRequestDto): Promise<void> {
		const { id, password } = dto;
		try {
			await this.authService.signupUser({
				id,
				password,
			});
			return;
		} catch (error) {
			if (error instanceof AuthServiceIdDuplicatedException) {
				throw new ConflictException('id 중복');
			}
			throw new Error();
		}
	}
}
