import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageEntity } from './entity/page.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PageEntity])
  ],
  controllers: [PageController],
  providers: [PageService]
})
export class PageModule { }
