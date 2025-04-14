import { 
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  UploadedFile,
  Req,
  BadRequestException,
  ParseIntPipe,
  HttpCode
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express'
import { diskStorage } from 'multer';
import { imageFileFilter, renameFIleName } from 'src/utils/fileupload.utils';
import { AboutService } from './about.service';
import { ABOUT_INFO_UPLOADS_FILES, OWNER_UPLOADS_FILES } from './constance/destination.constance';
import { AboutInfoDto, AboutOwnerDto, AboutTabloDto } from './dto/about.dto';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get('owner')
  @HttpCode(200)
  findOwner() {
    return this.aboutService.findOwner()
  }

  @Get('info')
  @HttpCode(200)
  findInfo() {
    return this.aboutService.findAboutInfo()
  }

  @Get('info/:id')
  @HttpCode(200)
  findInfoById(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.aboutService.findAboutInfoById(id)
  }

  @Get('tablo')
  @HttpCode(200)
  findTablo() {
    return this.aboutService.findAboutTablo()
  }

  @Post('owner')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: `${OWNER_UPLOADS_FILES}`,
      filename: (req, file, cb) => renameFIleName(req, file, cb)
    }),
    fileFilter: imageFileFilter
  }))
  @HttpCode(200)
  createOwner(
    @Body() dto: AboutOwnerDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Express.Request
  ) {
    if (!req.file) throw new BadRequestException("Выберите файл")
    return this.aboutService.createOwner(dto, file.filename)
  }

  @Put('owner/:id')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: `${OWNER_UPLOADS_FILES}`,
      filename: (req, file, cb) => renameFIleName(req, file, cb)
    }),
    fileFilter: imageFileFilter
  }))
  @HttpCode(200)
  updateOwner(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AboutOwnerDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Express.Request
  ) {
    if (!req.file) throw new BadRequestException("Выберите файл")
    return this.aboutService.updateOwner(id, dto, file.filename)
  }

  @Post('info')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: `${ABOUT_INFO_UPLOADS_FILES}`,
      filename: (req, file, cb) => renameFIleName(req, file, cb)
    }),
    fileFilter: imageFileFilter
  }))
  @HttpCode(200)
  createAboutInfo(
    @Body() dto: AboutInfoDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Express.Request
  ) {
    if (req.file) 
      return this.aboutService.createAboutInfo(dto, file.filename)
    else if (!req.file)
      return this.aboutService.createAboutInfo(dto)
  }

  @Put('info/:id')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: `${ABOUT_INFO_UPLOADS_FILES}`,
      filename: (req, file, cb) => renameFIleName(req, file, cb)
    }),
    fileFilter: imageFileFilter
  }))
  @HttpCode(200)
  updateAboutInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AboutInfoDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Express.Request
  ) {
    if (req.file) 
      return this.aboutService.updateAboutInfo(id, dto, file.filename)
    else if (!req.file)
      return this.aboutService.updateAboutInfo(id, dto)
  }

  @Post('tablo')
  @UsePipes(new ValidationPipe())
  createTablo(@Body() dto: AboutTabloDto) {
    return this.aboutService.createAboutTablo(dto)
  }

  @Put('tablo/:id')
  @UsePipes(new ValidationPipe())
  updateTablo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AboutTabloDto
  ) {
    return this.aboutService.updateAboutTablo(id, dto)
  }
}
