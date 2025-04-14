import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, ParseIntPipe, Post, Put, Req, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imageFileFilter, renameFIleName } from 'src/utils/fileupload.utils';
import { PARTNERS_UPLOADS_FILES } from './constance/destination.constance';
import { PartnersDto } from './dto/partners.dto';
import { PartnersService } from './partners.service';

@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: `${PARTNERS_UPLOADS_FILES}`,
      filename: (req, file, cb) => renameFIleName(req, file, cb)
    }),
    fileFilter: imageFileFilter
  }))
  create(
    @Body() dto: PartnersDto,
    @Req() req: Express.Request,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!req.file) throw new NotFoundException("Выберите изображение")
    return this.partnersService.create({...dto, image: file.filename})
  }

  @Put(':id')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: `${PARTNERS_UPLOADS_FILES}`,
      filename: (req, file, cb) => renameFIleName(req, file, cb)
    }),
    fileFilter: imageFileFilter
  }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PartnersDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.partnersService.update(id, {...dto, image: file.filename})
  }

  @Delete(':id')
  @HttpCode(200)
  delete(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.partnersService.delete(id)
  }

  @Get()
  @HttpCode(200)
  findAll() {
    return this.partnersService.findAllPartners()
  }

}
