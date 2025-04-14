import { 
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  HttpCode,
  UploadedFile,
  Delete
 } from '@nestjs/common';
import { JournalDto } from './dto/journal.dto';
import { JournalHeadDto } from './dto/journal.head.dto';
import { JournalHeadItemsDto } from './dto/journal.headItem.dto';
import { JournalService } from './journal.service';
import {diskStorage} from  'multer'
import {FileInterceptor} from '@nestjs/platform-express'
import { JOURNAL_UPLOADS_IMAGE } from './constance/desintation.constance';
import { imageFileFilter, renameFIleName } from 'src/utils/fileupload.utils';
import { IJournalCreateDto } from './dto/journal.create.dto';

@Controller('journal')
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Post(':pageId')
  @UsePipes(new ValidationPipe())
  @HttpCode(201)
  createJournal(
    @Param('pageId', ParseIntPipe) pageId: number,
    @Body() dto: IJournalCreateDto,
  ) {
    return this.journalService.createJournal(pageId, dto)
  }

  @Put(':id')
  updateJournal(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: JournalDto
  ) {
    return this.journalService.updateJournal(id, dto)
  }

  @Put('journalimage/:id')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor("image", {
    storage: diskStorage({
      destination: JOURNAL_UPLOADS_IMAGE,
      filename: (req, file, cb) => renameFIleName(req, file, cb)
    }),
    fileFilter: imageFileFilter
  }))
  updateJournalImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.journalService.updateJournalImage(id, image.filename)
  }

  @Delete(':id')
  deleteJournal(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.journalService.deleteJournal(id)
  }


  @Post('journalhead/:journalid')
  createJournalHead(
    @Param('journalid', ParseIntPipe) journalId: number,
    @Body() dto: JournalHeadDto
  ) {
    return this.journalService.createJournalHead(journalId, dto)
  }

  @Put('journalhead/:id')
  updateJournalHead(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: JournalHeadDto
  ) {
    return this.journalService.updateJournalHead(id, dto)
  }

  @Post('journalheaditems/:journalheadid')
  createJournalHeadItems(
    @Param('journalheadid', ParseIntPipe) journalheadId: number,
    @Body() dto: JournalHeadItemsDto
  ) {
    return this.journalService.createJournalHeadItems(journalheadId, dto)
  }

  @Put("journalheaditems/:id")
  updateJournalHeadItems(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: JournalHeadItemsDto
  ) {
    return this.journalService.updateJournalHeadItems(id, dto)
  }
}
