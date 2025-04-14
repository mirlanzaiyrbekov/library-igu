import { Module } from '@nestjs/common';
import { VestnikService } from './vestnik.service';
import { VestnikController } from './vestnik.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VestnikEntity } from './entity/vestnik.entity';
import { VestnikMaterialEntity } from './entity/vestnik.material.entity';
import { PageEntity } from 'src/page/entity/page.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([VestnikEntity, VestnikMaterialEntity, PageEntity])
  ],
  controllers: [VestnikController],
  providers: [VestnikService]
})
export class VestnikModule {}
