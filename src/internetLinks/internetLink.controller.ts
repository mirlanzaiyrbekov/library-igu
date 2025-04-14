import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from "@nestjs/common"
import { InternetLinkService } from "./internetLink.service"
import { InternetLinkCategoriesDto, InternetLinkDto } from "./dto/internetLink.dto"

@Controller("internet")
export class InternetLinkController {

  constructor(
    private readonly internetLinkService: InternetLinkService
  ) {}

  @Get('link/:id')
  @HttpCode(200)
  findLinkByCategory(@Param('id', ParseIntPipe) id: number) {
    return this.internetLinkService.findLinkByCategory(id)
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.internetLinkService.findById(id)
  }

  @Get()
  @HttpCode(200)
  findAll() {
    return this.internetLinkService.findAll()
  }

  @Post()
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  create(
    @Body() dto: InternetLinkDto
  ) {
    return this.internetLinkService.create(dto)
  }

  @Put(':id')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: InternetLinkDto
  ) {
    return this.internetLinkService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(201)
  delete(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.internetLinkService.delete(id)
  }

  @Post('link/:id')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  createLink(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: InternetLinkCategoriesDto
  ) {
    return this.internetLinkService.createLink(id, dto)
  }

  @Put('link/:id')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  updateLink(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: InternetLinkCategoriesDto
  ) {
    return this.internetLinkService.updateLink(id, dto)
  }

  @Delete('link/:id')
  @HttpCode(201)
  deleteLink(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.internetLinkService.deleteLink(id)
  }
}