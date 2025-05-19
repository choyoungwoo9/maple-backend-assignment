import {
	Body,
	Controller,
	HttpCode,
	Post,
	Headers,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignupUserRequestDto } from './dto/signup-user.request.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { WrapWith } from 'src/common/decorator/wrap-with.decorator';
import { AuthControllerExceptionWrapStrategy } from './exception/auth.controller.exception.wrap-strategy';
import { LoginRequestDto } from './dto/login.request.dto';
import { RegisterStaffRequestDto } from './dto/register-staff.request.dto';

@ApiTags('auth')
@Controller('auth')
@WrapWith(AuthControllerExceptionWrapStrategy)
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
		await this.authService.signupUser({
			id,
			password,
		});
		return;
	}

	@Post('users/login')
	@HttpCode(200)
	@ApiOperation({ summary: '로그인' })
	@ApiResponse({
		status: 200,
		description: '로그인 성공',
	})
	@ApiResponse({ status: 400, description: '요청 Body 형식 오류' })
	@ApiResponse({
		status: 401,
		description: '아이디 또는 비밀번호가 올바르지 않음',
	})
	async login(
		@Body() dto: LoginRequestDto,
	): Promise<{ accessToken: string }> {
		const { id, password } = dto;
		return await this.authService.login({
			id,
			password,
		});
	}

	@Post('staff/register')
	@ApiOperation({ summary: '스태프 등록' })
	@ApiResponse({
		status: 201,
		description: '스태프 등록 성공',
	})
	@ApiResponse({ status: 400, description: '요청 Body 형식 오류' })
	@ApiResponse({ status: 401, description: '권한 없음' })
	@ApiResponse({ status: 409, description: 'ID 중복' })
	async registerStaff(
		@Body() dto: RegisterStaffRequestDto,
		@Headers('authorization') authHeader: string,
	): Promise<void> {
		let token;
		try {
			token = authHeader?.split(' ')[1];
		} catch (error) {
			throw new UnauthorizedException('Authorization 헤더 형식 오류');
		}
		const authPayload = await this.authService.verifyToken(token);
		await this.authService.registerStaff({
			id: dto.id,
			password: dto.password,
			role: dto.role,
			adminExposedId: authPayload.exposedId,
		});
	}
}
