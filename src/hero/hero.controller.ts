import {
	Controller,
	UsePipes,
	ValidationPipe,
	HttpCode,
	Post,
	Put,
	Delete,
	Body,
	Param,
	ParseIntPipe,
	UseInterceptors,
	BadRequestException,
	HttpStatus
} from '@nestjs/common'
import { UploadedFile } from '@nestjs/common/decorators'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { imageFileFilter, renameFIleName } from 'src/utils/fileupload.utils'
import {
	HERO_NOT_FILE_IMAGE,
	HERO_UPLOADS_IMAGE
} from './constance/hero.constance'
import { HeroDto } from './dto/hero.dto'
import { HeroSubcontentDto } from './dto/HeroSubcontentDto'
import { HeroService } from './hero.service'

interface TestDTO {
	title: string
}

@Controller('hero')
export class HeroController {
	constructor(private readonly heroService: HeroService) {}

	@Post(':pageId')
	@UsePipes(new ValidationPipe())
	@UseInterceptors(
		FileInterceptor('background', {
			storage: diskStorage({
				destination: HERO_UPLOADS_IMAGE,
				filename: (req, file, cb) => renameFIleName(req, file, cb)
			}),
			fileFilter: imageFileFilter
		})
	)
	@HttpCode(200)
	createHero(
		@Param('pageId', ParseIntPipe) pageId: number,
		@Body() dto: HeroDto,
		@UploadedFile() background: Express.Multer.File
	) {
		if (!background) throw new BadRequestException(HERO_NOT_FILE_IMAGE)
		return this.heroService.createHero(pageId, {
			...dto,
			background: background.filename
		})
	}

	@Put(':id')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@UseInterceptors(
		FileInterceptor('background', {
			storage: diskStorage({
				destination: HERO_UPLOADS_IMAGE,
				filename: (req, file, cb) => renameFIleName(req, file, cb)
			}),
			fileFilter: imageFileFilter
		})
	)
	updateHero(
		@Param('id', ParseIntPipe) id: number,
		@Body(new ValidationPipe()) dto: TestDTO,
		@UploadedFile() background: Express.Multer.File
	) {
		return this.heroService.updateHero(id, dto, background.filename)
	}

	@Put('image/:id')
	@HttpCode(200)
	@UseInterceptors(
		FileInterceptor('background', {
			storage: diskStorage({
				destination: HERO_UPLOADS_IMAGE,
				filename: (req, file, cb) => renameFIleName(req, file, cb)
			}),
			fileFilter: imageFileFilter
		})
	)
	updateHeroImage(
		@Param('id') id: number,
		@UploadedFile() background: Express.Multer.File
	) {
		if (!background) throw new BadRequestException(HERO_NOT_FILE_IMAGE)
		return this.heroService.updateHeroImage(id, background.filename)
	}

	@Post('subcontent/:heroId')
	@HttpCode(200)
	createHeroSubcontent(
		@Param('heroId', ParseIntPipe) heroId: number,
		@Body(new ValidationPipe()) dto: HeroSubcontentDto
	) {
		return this.heroService.createHeroSubcontent(heroId, dto)
	}

	@Put('subcontent/:id')
	@HttpCode(200)
	updateHeroSubcontent(
		@Param('id', ParseIntPipe) id: number,
		@Body(new ValidationPipe()) dto: HeroSubcontentDto
	) {
		return this.heroService.updateHeroSubcontent(id, dto)
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	async deleteHero(@Param('id', ParseIntPipe) id: number) {
		return await this.heroService.deleteHero(id)
	}

	@Delete('subcontent/:id')
	deleteHeroSubcontent(@Param('id', ParseIntPipe) id: number) {
		return this.heroService.deleteHeroSubcontent(id)
	}
}
