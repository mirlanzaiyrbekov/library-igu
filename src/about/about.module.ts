import { Module } from '@nestjs/common';
import { AboutService } from './about.service';
import { AboutController } from './about.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AboutInformationEntity} from './entity/about.information.entity'
import {AboutOwnerEntity} from './entity/about.owner.entity'
import {AboutTabloEntity} from './entity/about.tablo.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([AboutInformationEntity, AboutTabloEntity, AboutOwnerEntity])
  ],
  controllers: [AboutController],
  providers: [AboutService]
})
export class AboutModule {}
