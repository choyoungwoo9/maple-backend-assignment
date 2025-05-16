import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SignupUserRequestDto } from './dto/signup-user.request.dto';
import { SignupUserResponseDto } from './dto/signup-user.response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('users/signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공 및 액세스 토큰 반환',
    type: SignupUserResponseDto,
  })
  @ApiResponse({ status: 400, description: '요청 Body 형식 오류' })
  @ApiResponse({ status: 401, description: 'id 중복' })
  async signupUser(
    @Body() dto: SignupUserRequestDto,
  ): Promise<SignupUserResponseDto> {
    const { id, password } = dto;
    const accessToken = await this.appService.signupUser(id, password);
    const response: SignupUserResponseDto = {
      accessToken: accessToken,
    };
    return response;
  }
}
