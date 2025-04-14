import { Module } from '@nestjs/common';
import { JournalService } from './journal.service';
import { JournalController } from './journal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalEntity } from './entity/journal.entity';
import { JournalHeadEntity } from './entity/journal.head.entity';
import { JournalHeadItemsEntity } from './entity/journal.headItems.entity';
import { PageEntity } from 'src/page/entity/page.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PageEntity,JournalEntity, JournalHeadEntity, JournalHeadItemsEntity])
  ],
  controllers: [JournalController],
  providers: [JournalService]
})
export class JournalModule {}
