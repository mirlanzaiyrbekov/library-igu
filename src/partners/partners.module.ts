import { Module } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { PartnersController } from './partners.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersEntity } from './entity/partners.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PartnersEntity])
  ],
  controllers: [PartnersController],
  providers: [PartnersService]
})
export class PartnersModule {}
