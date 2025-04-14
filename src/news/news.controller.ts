import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Req, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';
import { DefaultValuePipe } from '@nestjs/common/pipes';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imageFileFilter, renameFIleName } from 'src/utils/fileupload.utils';
import { NEWS_UPLOADS_FILES } from './constance/destination.constance';
import { NewsDto } from './dto/news.dto';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}
  
  @Get('news/limit')
  findNewsOnLimit(
    @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit: number = 3
  ) {
    return this.newsService.findNewsByLimit(+limit)
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: `${NEWS_UPLOADS_FILES}`,
      filename: (req, file, cb) => renameFIleName(req, file, cb)
    }),
    fileFilter: imageFileFilter
  }))
  @HttpCode(200)
  create(
    @Body() dto: NewsDto,
    @Req() req: Express.Request, 
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!req.file) throw new BadRequestException("Выберите изображение")
    return this.newsService.create(dto, file.filename)
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: `${NEWS_UPLOADS_FILES}`,
      filename: (req, file, cb) => renameFIleName(req, file, cb)
    }),
    fileFilter: imageFileFilter
  }))
  @HttpCode(200)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: NewsDto,
    @Req() req: Express.Request, 
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!req.file) throw new BadRequestException("Выберите изображение")
    return this.newsService.update(id, dto, file.filename)
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.delete(id)
  }

  @Get('news/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.findOne(id)
  }

  @Get()
  findAllNewsWithPaginate(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit: number = 6
  ) {
    limit = limit >100 ? 100: limit
    return this.newsService.findAllWithPaginate({limit, page})
  }

  @Get('newses')
  findAllNews() {
    return this.newsService.findAllNews()
  }

}
