import {
	Controller,
	HttpCode,
	Post,
	Body,
	ValidationPipe,
	UsePipes
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AutLoginhDto, AutRegisterhDto } from './dto/auth.dto'
import { ParseIntPipe } from '@nestjs/common/pipes'
import { HttpStatus } from '@nestjs/common/enums'
import { Auth } from './decorators/auth.decorator'
import { Request } from 'express'
import { CurrentUser } from 'src/users/decorator/user.decorator'
import { UserEntity } from 'src/users/entity/user.entity'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@UsePipes(new ValidationPipe())
  login(@Body() dto: AutLoginhDto) {
		return this.authService.login(dto)
	}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	@UsePipes(new ValidationPipe())
	register(@Body() dto: AutRegisterhDto) {
		return this.authService.register(dto)
	}

	@Auth('jwt')
	@Post('logout')
	@HttpCode(HttpStatus.OK)
	logout(@CurrentUser() user: UserEntity) {
		return this.authService.logout(user['sub'])
	}

	@Auth('jwt-refresh')
	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	refreshToken(@CurrentUser() user: UserEntity) {
		return this.authService.refreshToken(user['sub'], user['refreshToken'])
	}
}
