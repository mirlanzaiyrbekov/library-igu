import { Module } from '@nestjs/common';
import { HeroService } from './hero.service';
import { HeroController } from './hero.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeroEntity } from './entity/hero.entity';
import { HeroSubcontentEntity } from './entity/hero.subcontent.entity';
import { PageEntity } from 'src/page/entity/page.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([HeroEntity, HeroSubcontentEntity, PageEntity])
  ],
  controllers: [HeroController],
  providers: [HeroService]
})
export class HeroModule { }
