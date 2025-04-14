import {
	HttpCode,
	Controller,
	Post,
	Body,
	Param,
	Get,
	Delete,
	Put,
	ValidationPipe,
	ParseIntPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { PageDto } from './dto/page.dto'
import { PageService } from './page.service'

@Controller('page')
export class PageController {
	constructor(private readonly pageService: PageService) {}

	@Get()
	@HttpCode(200)
	getPages() {
		return this.pageService.getAllPages()
	}

	@Get(':id')
	@HttpCode(201)
	getPage(@Param('id', ParseIntPipe) id: number) {
		return this.pageService.getById(id)
	}

	@Post()
	@HttpCode(201)
	/**** FOR AUTH ADMIN */
	// @Auth('jwt')
	createPage(@Body(new ValidationPipe()) dto: PageDto) {
		return this.pageService.createPage(dto)
	}

	@Put(':pageId')
	@HttpCode(200)
	/**** FOR AUTH ADMIN */
	@Auth('jwt')
	updatePage(
		@Param('pageId', ParseIntPipe) pageId: number,
		@Body(new ValidationPipe()) dto: PageDto
	) {
		return this.pageService.updatePage(pageId, dto)
	}

	@Delete(':pageId')
	@HttpCode(204)
	@Auth('jwt')
	deletePage(@Param('pageId', ParseIntPipe) pageId: number) {
		return this.pageService.deletePage(pageId)
	}
}
