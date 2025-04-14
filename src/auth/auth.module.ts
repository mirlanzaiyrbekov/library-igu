import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getJwtConfig } from 'src/config/jwt.config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from 'src/users/entity/user.entity'
import { AuthStrategy } from './strategy/at.strategy'
import { RtStrategy } from './strategy/rt.strategy'

@Module({
	imports: [
		ConfigModule,
		JwtModule.register({}),
		TypeOrmModule.forFeature([UserEntity])
	],
	controllers: [AuthController],
	providers: [AuthService, AuthStrategy, RtStrategy]
})
export class AuthModule {}
