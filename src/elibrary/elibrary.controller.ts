import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  HttpCode,
  Body,
  Param,
  Req,
  UploadedFile,
  NotFoundException,
  BadRequestException,
  ParseIntPipe,
  Query,
  DefaultValuePipe
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFileFilter, imageFileFilter, renameFIleName } from 'src/utils/fileupload.utils';
import { BOOK_CATEGORY_UPLOADS_FILES, BOOK_IMAGE_UPLOADS_FILES, BOOK_UPLOADS_FILES } from './constance/destination';
import { ElibraryBookDto, ElibraryCategoryDto, ElibraryDto } from './dto/elibrary.dto';
import { ElibraryService } from './elibrary.service';

@Controller('elibrary')
export class ElibraryController {
  constructor(private readonly elibraryService: ElibraryService) {}
  
  @Get('books')
  @HttpCode(200)
  findAllBooks() {
    return this.elibraryService.findAllBooks()
  }

  @Get()
  @HttpCode(200)
  findAll() {
    return this.elibraryService.findAll()
  }

  @Get('remaining')
  @HttpCode(200)
  findAllRemaining() {
    return this.elibraryService.findAllRemaining()
  }


  @Get('category')
  @HttpCode(200)
  findAllCategory() {
    return this.elibraryService.findAllCategory()
  }

  @Get(':id')
  @HttpCode(200)
  findById(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.elibraryService.findById(id)
  }



  @Get('category/:id')
  @HttpCode(200)
  findCategoryByMainCategory(
    @Param('id', ParseIntPipe) mainCategoryId: number
  ) {
    return this.elibraryService.findCategoryByMainCategory(mainCategoryId)
  }

  @Get('category/category/:id')
  findCategoryById(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.elibraryService.findCategoryById(id)
  }

  @Get('books/category/:id')
  @HttpCode(200)
  findBooksByCategory(
    @Param('id', ParseIntPipe) categoryId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit: number = 5
  ) {
    limit = limit > 100 ? 100: limit
    return this.elibraryService.findBooksByCategory({page, limit}, categoryId)
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: `${BOOK_CATEGORY_UPLOADS_FILES}`,
      filename: (req, file, cb) => renameFIleName(req, file, cb)
    }),
    fileFilter: imageFileFilter
  }))
  @HttpCode(200)
  create(
    @Body() dto: ElibraryDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Express.Request
  ) {
    if (!req.file) throw new BadRequestException("Выберите изображение")
    return this.elibraryService.create(dto, file.filename)
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: `${BOOK_CATEGORY_UPLOADS_FILES}`,
      filename: (req, file, cb) => renameFIleName(req, file, cb)
    }),
    fileFilter: imageFileFilter
  }))
  @HttpCode(200)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ElibraryDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Express.Request
  ) {
    if (!req.file) throw new BadRequestException("Выберите изображение")
    return this.elibraryService.update(id, dto, file.filename)
  }

  @Delete(':id')
  @HttpCode(201)
  deleteMainCategory(@Param('id', ParseIntPipe) id: number) {
    return this.elibraryService.deleteMainCategory(id)
  }

  @Post('category/:id')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  createCategory(
    @Param('id', ParseIntPipe) mainCategoryId: number,
    @Body() dto: ElibraryCategoryDto
  ) {
    return this.elibraryService.createCategory(mainCategoryId, dto)
  }

  @Put('category/:id')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ElibraryCategoryDto
  ) {
    return this.elibraryService.updateCategory(id, dto)
  }

  @Delete('category/:id')
  @HttpCode(200)
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.elibraryService.deleteCategory(id)
  }


  @Post('book/:id')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: `${BOOK_UPLOADS_FILES}`,
      filename: (req, file, cb) => renameFIleName(req, file, cb)
    }),
    fileFilter: fileFileFilter
  }))
  @HttpCode(200)
  createBook(
    @Param('id', ParseIntPipe) categoryId: number,
    @Body() dto: ElibraryBookDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Express.Request
  ) {
    if (!req.file) throw new BadRequestException("Выберите файл")
    return this.elibraryService.createBook(categoryId, dto, file.filename)
  }


  @Put('book/:id')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: `${BOOK_UPLOADS_FILES}`,
      filename: (req, file, cb) => renameFIleName(req, file, cb)
    }),
    fileFilter: fileFileFilter
  }))
  @HttpCode(200)
  updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ElibraryBookDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Express.Request
  ) {
    if (!req.file) throw new BadRequestException("Выберите файл")
    return this.elibraryService.updateBook(id, dto, file.filename)
  }

  @Delete('books/:id')
  @HttpCode(201)
  deleteBooks(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.elibraryService.deleteBook(id)
  }

  @Put('book-views/:id')
  @HttpCode(200)
  updateBookView(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.elibraryService.updateBookView(id)
  }

  @Post('remaining')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: `${BOOK_IMAGE_UPLOADS_FILES}`,
      filename: (req, file, cb) => renameFIleName(req, file, cb)
    }),
    fileFilter: imageFileFilter
  }))
  @HttpCode(200)
  createRemaining(
    @UploadedFile() image: Express.Multer.File,
    @Req() req: Express.Request
  ) {
    if (!req.file) throw new BadRequestException('Выберите файл')
    return this.elibraryService.createElibraryRemaining(image.filename)
  }

  @Put('remaining/:id')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: `${BOOK_IMAGE_UPLOADS_FILES}`,
      filename: (req, file, cb) => renameFIleName(req, file, cb)
    }),
    fileFilter: imageFileFilter
  }))
  @HttpCode(200)
  updateRemaining(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() image: Express.Multer.File,
    @Req() req: Express.Request
  ) {
    if (!req.file) throw new BadRequestException('Выберите файл')
    return this.elibraryService.updateElibraryRemaining(id, image.filename)
  }

  @Delete('remaining/:id')
  deleteRemaining(@Param('id', ParseIntPipe) id: number) {
    return this.elibraryService.deleteElibraryRemaining(id)
  }
}
