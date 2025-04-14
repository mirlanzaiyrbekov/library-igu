import {Module} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { WindowEntity } from './entity/window.entity';
import { WindowCategoryEntity } from './entity/window.category.entity';
import { WindowService } from './window.service';
import { WindowController } from './window.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([WindowEntity, WindowCategoryEntity])
  ],
  controllers: [WindowController],
  providers: [WindowService]
})
export class WindowModule {

}