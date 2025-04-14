import { Module } from '@nestjs/common';
import { TabsService } from './tabs.service';
import { TabsController } from './tabs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TabsEntity } from './entity/tabs.entity';
import { TabsLinkEntity } from './entity/tabs.islink';
import { PageEntity } from 'src/page/entity/page.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TabsEntity, TabsLinkEntity, PageEntity])
  ],
  controllers: [TabsController],
  providers: [TabsService]
})
export class TabsModule {}
