import {Module} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageCardEntity } from './entity/imageCard.entity';
import { ImageCardController } from './imageCard.controller';
import { ImageCardService } from './imageCard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageCardEntity])
  ],
  controllers: [ImageCardController],
  providers: [ImageCardService]
})
export class ImageCardModule {}