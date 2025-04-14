import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common'
import { SearchService } from './search.service'

@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async mainSearch(@Query('find') searchTerm: string) {
		return await this.searchService.mainSearch(searchTerm)
	}
}
