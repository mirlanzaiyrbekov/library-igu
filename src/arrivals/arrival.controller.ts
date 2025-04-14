import { Controller, NotFoundException, ParseIntPipe, ValidationPipe } from "@nestjs/common";
import { Body, Delete, Get, HttpCode, Param, Post, Put, Req, UploadedFile, UseInterceptors, UsePipes } from "@nestjs/common/decorators";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { imageFileFilter, renameFIleName } from "src/utils/fileupload.utils";
import { ArrivalService } from "./arrival.service";
import {  ARRIVAL_UPLOADS_FILES } from "./constance/destination.constance";

@Controller("arrival")
export class ArrivalController {

  constructor(
    private readonly arrivalService: ArrivalService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: ARRIVAL_UPLOADS_FILES,
      filename: (req, file, cb) => renameFIleName(req, file, cb)
    }),
    fileFilter: imageFileFilter
  }))
  @HttpCode(200)
  createImage(
    @Req() req: Express.Request,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!req.file) throw new NotFoundException("Файл не выбран")
    return this.arrivalService.createImage({image: file.filename})
  }


  @Put(':id')
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: ARRIVAL_UPLOADS_FILES,
      filename: (req, file, cb) => renameFIleName(req, file, cb)
    }),
    fileFilter: imageFileFilter
  }))
  @HttpCode(200)
  updateImage(
    @Req() req: Express.Request,
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number
  ) {
    if (!req.file) throw new NotFoundException("Файл не выбран")
    return this.arrivalService.updateImage(id, {image: file.filename})
  }


  @Get('image/:id')
  @HttpCode(200)
  findOneImage(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.arrivalService.findImageById(id)
  }

  @Get('images')
  @HttpCode(200)
  findAllImage() {
    return this.arrivalService.findAllimage()
  }

  @Delete('image/:id')
  deleteImage(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.arrivalService.deleteImage(id)
  }
  
}