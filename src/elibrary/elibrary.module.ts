import { Module } from '@nestjs/common';
import { ElibraryService } from './elibrary.service';
import { ElibraryController } from './elibrary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElibraryEntity } from './entity/elibrary.entity';
import { ElibraryCategoryEntity } from './entity/elibrary.category.enity';
import { ElibraryBooksEntity } from './entity/elibrary.books.entity';
import { ElibraryRemainingEntity } from './entity/elibrary.remaining.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ElibraryEntity, ElibraryCategoryEntity, ElibraryBooksEntity, ElibraryRemainingEntity])
  ],
  controllers: [ElibraryController],
  providers: [ElibraryService]
})
export class ElibraryModule {}
