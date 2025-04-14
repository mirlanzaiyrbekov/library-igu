import {Module} from '@nestjs/common'
import { InternetLinkService } from './internetLink.service'
import { InternetLinkController } from './internetLink.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InternetLinkEntity } from './entity/internetLinkEntity'
import { InternetLinkCategoriesEntity } from './entity/internetLink.categories.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([InternetLinkEntity, InternetLinkCategoriesEntity])
  ],
  controllers: [InternetLinkController],
  providers: [InternetLinkService]
})
export class InternetLinkModule {}