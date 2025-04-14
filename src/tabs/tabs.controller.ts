import { Controller, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { Body, Delete, HttpCode, Param, Post, Put, Get, Req, UploadedFile, UseInterceptors, UsePipes } from '@nestjs/common/decorators';
import { BadRequestException } from '@nestjs/common/exceptions';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFileFilter, filesFileFilter, renameFIleName } from 'src/utils/fileupload.utils';
import { TABS_UPLOADS_FILES } from './constance/destination.constance';
import { TabsDto, TabsLinkDto } from './dto/tabs.dto';
import { TabsService } from './tabs.service';

@Controller('tabs')
export class TabsController {
  constructor(private readonly tabsService: TabsService) {}

  @Get()
  getAllTabs() {
    return this.tabsService.findAllTabs()
  }

  @Get(':id')
  @HttpCode(200)
  getTab(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.tabsService.findTabById(id)
  }

  @Post(':pageId')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  createTab(
    @Param('pageId', ParseIntPipe) pageId: number,
    @Body() dto: TabsDto
  ) {
    return this.tabsService.createTab(pageId, dto)
  }

  @Put(':id')
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  updateTab(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: TabsDto
  ) {
    return this.tabsService.updateTab(id, dto)
  }

  @Post('tablink/:id')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: `${TABS_UPLOADS_FILES}`,
      filename: (req, file, cb) => renameFIleName(req, file, cb)
    }),
    fileFilter: fileFileFilter
  }))
  @HttpCode(201)
  createTabLink(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: TabsLinkDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Express.Request
  ) {
    if (!req.file) throw new BadRequestException("Выберите файл")
    return this.tabsService.createTabLink(id, dto, file.filename)
  }
  
  @Put('tablink/:id')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: `${TABS_UPLOADS_FILES}`,
      filename: (req, file, cb) => renameFIleName(req, file, cb)
    }),
    fileFilter: fileFileFilter
  }))
  @HttpCode(201)
  updateTabLink(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: TabsLinkDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Express.Request
  ) {
    if (!req.file) throw new BadRequestException("Выберите файл")
    return this.tabsService.updateTabLink(id, dto, file.filename)
  }

  @Put('tablink/image/:id')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: TABS_UPLOADS_FILES,
      filename: (req, file, cb) => renameFIleName(req, file, cb)
    }),
    fileFilter: filesFileFilter
  }))
  updateTabLinkFile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.tabsService.uploadTabLinkFile(id, file.filename)
  }

  @Delete('tablink/:id')
  deleteTabLink(
    @Param('id') id: number
  ) {
    return this.tabsService.deleteTabLink(id)
  }
  
  @Delete(':id')
  deleteTab(
    @Param('id') id: number
  ) {
    return this.tabsService.deleteTab(id)
  }
}
