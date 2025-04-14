import { Module } from '@nestjs/common'
import { NewsModule } from 'src/news/news.module'
import { TeachersModule } from 'src/teachers/teachers.module'
import { VestnikModule } from 'src/vestnik/vestnik.module'
import { SearchController } from './search.controller'
import { SearchService } from './search.service'
import { TeachersService } from 'src/teachers/teachers.service'
import { NewsService } from 'src/news/news.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NewsEntity } from 'src/news/entity/news.entity'
import { TeachersEntity } from 'src/teachers/entity/teachers.entity'
import { VestnikEntity } from 'src/vestnik/entity/vestnik.entity'
import { TeachersWorksEntity } from 'src/teachers/entity/teachers.works.entity'
import { VestnikMaterialEntity } from 'src/vestnik/entity/vestnik.material.entity'
import { VestnikService } from 'src/vestnik/vestnik.service'
import { PageEntity } from 'src/page/entity/page.entity'
import { ElibraryEntity } from 'src/elibrary/entity/elibrary.entity'
import { ElibraryBooksEntity } from 'src/elibrary/entity/elibrary.books.entity'
import { ElibraryModule } from 'src/elibrary/elibrary.module'
import { ElibraryService } from 'src/elibrary/elibrary.service'
import { ElibraryCategoryEntity } from 'src/elibrary/entity/elibrary.category.enity'
import { ElibraryRemainingEntity } from 'src/elibrary/entity/elibrary.remaining.entity'

@Module({
	controllers: [SearchController],
	imports: [
		TypeOrmModule.forFeature([
			NewsEntity,
			TeachersEntity,
			VestnikEntity,
			VestnikMaterialEntity,
			TeachersWorksEntity,
			PageEntity,
			ElibraryEntity,
			ElibraryBooksEntity,
			ElibraryCategoryEntity,
			ElibraryRemainingEntity
		]),
		TeachersModule,
		VestnikModule,
		NewsModule,
		ElibraryModule
	],
	providers: [
		SearchService,
		TeachersService,
		NewsService,
		VestnikService,
		ElibraryService
	]
})
export class SearchModule {}
