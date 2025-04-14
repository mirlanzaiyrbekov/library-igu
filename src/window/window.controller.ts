import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  UseInterceptors,
  ParseIntPipe,
  ValidationPipe,
  HttpCode,
  Param,
  Req,
  UsePipes,
  Body,
  UploadedFile,
  BadRequestException
} from '@nestjs/common'
import {WINDOW_UPLOADS_IMAGE} from './constance/destination.constance'
import {FileInterceptor} from '@nestjs/platform-express'
import { WindowService } from './window.service';
import { MainCategoryDto } from './dto/windowMainCategory.dto';
import { WindowCategoryDto } from './dto/window.category.dto';
import { diskStorage } from 'multer';
import { fileFileFilter, renameFIleName } from 'src/utils/fileupload.utils';

@Controller("window")
export class WindowController {

  constructor(
    private readonly windoService: WindowService
  ) {}

  @Get('category')
  @HttpCode(200)
  findAllSecondCategories() {
    return this.windoService.findAllSecondCategories()
  }

  @Get('category/:id')
  @HttpCode(200)
  findSecondCategoryById(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.windoService.findSecondCategoryById(id)
  }

  @Get('category/category/:id')
  @HttpCode(200)
  findSecondCategoryByMainCategory(
    @Param('id', ParseIntPipe) categoryId: number
  ) {
    return this.windoService.findSecondCategoryByMainCategory(categoryId)
  }

  @Get()
  @HttpCode(200)
  findAllMainCategories() {
    return this.windoService.findAllMainCategories()
  }

  @Get(':id')
  @HttpCode(200)
  findMainCategoryById(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.windoService.findMainCategoryById(id)
  }

  @Post()
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  createMainCategory(
    @Body() dto: MainCategoryDto
  ) {
    return this.windoService.createMainCategory(dto)
  }

  @Put(':id')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  updateMainCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: MainCategoryDto
  ) {
    return this.windoService.updateMainCategory(id, dto)
  }

  @Post('category/:id')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: `${WINDOW_UPLOADS_IMAGE}`,
      filename: (req, file, cb) => renameFIleName(req, file, cb)
    }),
    fileFilter: fileFileFilter 
  }))
  createSecondCategory(
    @Param('id', ParseIntPipe) categoryId: number,
    @Body() dto: WindowCategoryDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Express.Request
  ) {
    if (!req.file) throw new BadRequestException("Выберите файл")
    return this.windoService.createSecondCategory(categoryId, dto, file.filename)
  }

  @Put('category/:id')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: `${WINDOW_UPLOADS_IMAGE}`,
      filename: (req, file, cb) => renameFIleName(req, file, cb)
    }),
    fileFilter: fileFileFilter 
  }))
  updateSecondCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: WindowCategoryDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Express.Request
  ) {
    if (!req.file) throw new BadRequestException("Выберите файл")
    return this.windoService.updateSecondCategory(id, dto, file.filename)
  }

  @Delete(':id')
  @HttpCode(200)
  deleteMainCategory(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.windoService.deleteMainCategory(id)
  }

  @Delete('category/:id')
  @HttpCode(200)
  deleteSecondCategory(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.windoService.deleteSecondCategory(id)
  }
}