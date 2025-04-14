import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { NewsEntity } from 'src/news/entity/news.entity'
import { TeachersEntity } from 'src/teachers/entity/teachers.entity'
import { VestnikEntity } from 'src/vestnik/entity/vestnik.entity'
import { ILike, Repository } from 'typeorm'
import { SearchDto } from './dto/search.dto'
import { TeachersWorksEntity } from 'src/teachers/entity/teachers.works.entity'
import { TeachersService } from 'src/teachers/teachers.service'
import { VestnikMaterialEntity } from 'src/vestnik/entity/vestnik.material.entity'
import { VestnikService } from 'src/vestnik/vestnik.service'
import { ElibraryService } from 'src/elibrary/elibrary.service'
import { ISearchResult } from 'src/interfaces/search.interface'
import { searchResultEnum } from 'src/enum/SearchEnum'

@Injectable()
export class SearchService {
	constructor(
		@InjectRepository(TeachersWorksEntity)
		private readonly teachersWorksRepository: Repository<TeachersWorksEntity>,
		@InjectRepository(VestnikMaterialEntity)
		private readonly vestnikMaterialRepository: Repository<VestnikMaterialEntity>,
		@InjectRepository(NewsEntity)
		private readonly newsRepository: Repository<NewsEntity>,
		private readonly teachersService: TeachersService,
		private readonly vestnikService: VestnikService,
		private readonly elibraryService: ElibraryService
	) {}

	async mainSearch(searchTerm: string) {
		let searchResults: ISearchResult[] = []
		if (searchTerm) {
			const worksResults = await this.teachersService.findAllWork(searchTerm)
			if (worksResults.length)
				searchResults.push({
					data: worksResults,
					source: searchResultEnum.WORKS
				})
			const vestnikResults = await this.vestnikService.findVestnikMaterials(
				searchTerm
			)
			if (vestnikResults.length)
				searchResults.push({
					data: vestnikResults,
					source: searchResultEnum.VESTNIK
				})

			const elibraryResults = await this.elibraryService.findAllBooks(
				searchTerm
			)
			if (elibraryResults.length)
				searchResults.push({
					data: elibraryResults,
					source: searchResultEnum.ELIBRARY
				})

			// const newsResults = await this.newsRepository.find({
			// 	where: {
			// 		title: ILike(`%${searchTerm}%`),
			// 		description: ILike(`%${searchTerm}%`)
			// 	}
			// })
			// if (newsResults.length)
			// 	searchResults.push({ data: newsResults, source: searchResultEnum.NEWS })
		}
		return searchResults
	}
}
