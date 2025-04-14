import { BadRequestException, Body, Put, Param, Controller, Get, HttpCode, Post, Req, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { ParseIntPipe } from "@nestjs/common/pipes";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { imageFileFilter, renameFIleName } from "src/utils/fileupload.utils";
import { IMAGECARD_UPLOADS_FILES } from "./constance/destination.constance";
import { ImageCardDto } from "./dto/imageCard.dto";
import { ImageCardService } from "./imageCard.service";

@Controller("imagecard")
export class ImageCardController {

  constructor(private readonly imageCardService: ImageCardService) {}

  @Get()
  @HttpCode(200)
  findAll() {
    return this.imageCardService.findAll()
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: `${IMAGECARD_UPLOADS_FILES}`,
      filename: (req, file, cb) => renameFIleName(req, file, cb)
    }),
    fileFilter: imageFileFilter
  }))
  @HttpCode(200)
  create(
    @Body() dto: ImageCardDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Express.Request
  ) {
    if (!req.file) throw new BadRequestException("Выберите файл")
    return this.imageCardService.create(dto, file.filename)
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: `${IMAGECARD_UPLOADS_FILES}`,
      filename: (req, file, cb) => renameFIleName(req, file, cb)
    }),
    fileFilter: imageFileFilter
  }))
  @HttpCode(200)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ImageCardDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Express.Request
  ) {
    if (!req.file) throw new BadRequestException("Выберите файл")
    return this.imageCardService.update(id, dto, file.filename)
  }
}