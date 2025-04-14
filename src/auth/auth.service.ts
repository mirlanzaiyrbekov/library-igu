import { Injectable, NotFoundException, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { USER_ALREADY_EXIST, USER_NOT_FOUND, USER_WRONG_PASSWORD } from './constance/auth.message.constance';
import { AutLoginhDto, AutRegisterhDto } from './dto/auth.dto';
import {compare, genSalt, hash} from 'bcryptjs'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepositroy: Repository<UserEntity>,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {}

	async login(dto: AutLoginhDto) {
		const user = await this.validateUser(dto)
		const tokens = await this.generateTokens(user.id, user.email)
		await this.updateRtHash(user.id, tokens.refreshToken)
		return {
			user: this.returnUserField(user),
			...tokens
		}
	}

	async register(dto: AutRegisterhDto) {
		const oldUser = await this.userRepositroy.findOneBy({ email: dto.email })
		if (oldUser) throw new BadRequestException(USER_ALREADY_EXIST)

		const hashPassword = await this.hashData(dto.password)

		const newUser = this.userRepositroy.create({
			name: dto.name,
			email: dto.email,
			password: hashPassword,
		})
		const user = await this.userRepositroy.save(newUser)
		const tokens = await this.generateTokens(user.id, user.email)
		await this.updateRtHash(user.id, tokens.refreshToken)
		return {
			user: this.returnUserField(user),
			...tokens
		}
	}

	async logout(userId: number) {
		await this.userRepositroy.update(userId, { hashed_rt: null })
	}

	async refreshToken(userId: number, refreshT: string) {
		const user = await this.userRepositroy.findOne({where: {id: userId}})
		if (!user) throw new ForbiddenException('Access Denied!')
		const refresh_tokenMatch = await compare(refreshT, user.hashed_rt)
		if (!refresh_tokenMatch) throw new ForbiddenException('Access Denied!')
		const tokens = await this.generateTokens(user.id, user.email)
		await this.updateRtHash(user.id, tokens.refreshToken)
		return tokens
	}

	async generateTokens(userId: number, email: string) {
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(
				{
					sub: userId,
					email
				},
				{
					secret: this.configService.get('JWT_ACCESS_TOKEN'),
					expiresIn: 60 * 10
				}
			),
			this.jwtService.signAsync(
				{
					sub: userId,
					email
				},
				{
					secret: this.configService.get('JWT_REFRESH_TOKEN'),
					expiresIn: 60 * 60 * 24 * 7
				}
			)
		])
		return {
			accessToken,
			refreshToken
		}
	}

	async updateRtHash(userId: number, refreshT: string) {
		const hash = await this.hashData(refreshT)
		await this.userRepositroy.update(userId, {
			hashed_rt: hash
		})
	}

	async validateUser(dto: Pick<AutLoginhDto, 'email' | 'password'>) {
		const user = await this.userRepositroy.findOne({
			where: { email: dto.email },
			select: ['id', 'name', 'email', 'role', 'password']
		})
		if (!user) throw new NotFoundException(USER_NOT_FOUND)
		const comparePassword = await compare(dto.password, user.password)
		if (!comparePassword) throw new UnauthorizedException(USER_WRONG_PASSWORD)
		return user
	}

	hashData(data: string) {
		return hash(data, 10)
	}

	returnUserField(user: UserEntity) {
		return {
			id: user.id,
			name: user.name,
			role: user.role,
			email: user.email
		}
	}
}
