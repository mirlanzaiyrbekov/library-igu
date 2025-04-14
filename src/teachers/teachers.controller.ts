import {
	BadRequestException,
	DefaultValuePipe,
	ParseIntPipe,
	ValidationPipe
} from '@nestjs/common'
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	Req,
	UploadedFile,
	UseInterceptors,
	UsePipes
} from '@nestjs/common/decorators'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { fileFileFilter, renameFIleName } from 'src/utils/fileupload.utils'
import { WORK_UPLOADS_FILES } from './constance/destination.constance'
import { TeachersDto } from './dto/teachers.dto'
import { TeachersWorkDto } from './dto/teachers.work.dto'
import { TeachersService } from './teachers.service'

@Controller('teachers')
export class TeachersController {
	constructor(private readonly teachersService: TeachersService) {}
	@Get('works/limit')
	findWorksLimit(
		@Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit: number = 3
	) {
		return this.teachersService.findWorksLimit(limit)
	}

	@Get('works')
	@HttpCode(200)
	async findAllWork(@Query('search') searchTerm: string) {
		return await this.teachersService.findAllWork(searchTerm)
	}

	@Get('works/:id')
	@HttpCode(200)
	findOneWork(@Param('id', ParseIntPipe) id: number) {
		return this.teachersService.findOneWork(id)
	}

	@Get('works/category/:id')
	findWorkByCategory(
		@Param('id', ParseIntPipe) id: number,
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
		@Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit: number = 3
	) {
		limit = limit > 100 ? 100 : limit
		return this.teachersService.findWorkByCategory(
			{
				page,
				limit
			},
			id
		)
	}

	@Get()
	@HttpCode(200)
	findAll() {
		return this.teachersService.findAll()
	}

	@Get(':id')
	@HttpCode(200)
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.teachersService.findOne(id)
	}

	@Post()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	create(@Body() dto: TeachersDto) {
		return this.teachersService.create(dto)
	}

	@Put(':id')
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	update(@Param('id', ParseIntPipe) id: number, @Body() dto: TeachersDto) {
		return this.teachersService.update(id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	delete(@Param('id', ParseIntPipe) id: number) {
		return this.teachersService.delete(id)
	}

	@Post('works/:id')
	@UsePipes(new ValidationPipe())
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: `${WORK_UPLOADS_FILES}`,
				filename: (req, file, cb) => renameFIleName(req, file, cb)
			}),
			fileFilter: fileFileFilter
		})
	)
	@HttpCode(200)
	crateWork(
		@Param('id', ParseIntPipe) id: number,
		@Req() req: Express.Request,
		@Body() dto: TeachersWorkDto,
		@UploadedFile() file: Express.Multer.File
	) {
		if (!req.file) throw new BadRequestException('Выберите файл')
		return this.teachersService.createWork(id, dto, file.filename)
	}

	@Put('works/:id')
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: `${WORK_UPLOADS_FILES}`,
				filename: (req, file, cb) => renameFIleName(req, file, cb)
			}),
			fileFilter: fileFileFilter
		})
	)
	updateWork(
		@Param('id', ParseIntPipe) id: number,
		@Req() req: Express.Request,
		@Body() dto: TeachersWorkDto,
		@UploadedFile() file: Express.Multer.File
	) {
		if (!req.file) throw new BadRequestException('Выберите файл')
		return this.teachersService.updateWork(id, dto, file.filename)
	}

	@Delete('works/:id')
	@HttpCode(200)
	deleteWork(@Param('id', ParseIntPipe) id: number) {
		return this.teachersService.deleteWork(id)
	}

	@Post('works-views/:id')
	updateWorkView(@Param('id', ParseIntPipe) id: number) {
		return this.teachersService.updateWorksView(id)
	}

	@Post('works-downloaded/:id')
	updateWorkDownload(@Param('id', ParseIntPipe) id: number) {
		return this.teachersService.updateWorksDownloaded(id)
	}
}
