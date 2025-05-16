import { ApiProperty } from '@nestjs/swagger';

export class SignupUserRequestDto {
  @ApiProperty({
    description: '사용자 아이디',
    example: 'id',
  })
  id: string;

  @ApiProperty({
    description: '사용자 비밀번호',
    example: 'password',
  })
  password: string;
}
