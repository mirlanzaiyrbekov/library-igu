import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InternetLinkEntity } from './entity/internetLinkEntity'
import { Repository } from 'typeorm'
import { InternetLinkCategoriesEntity } from './entity/internetLink.categories.entity'
import { InternetLinkCategoriesDto, InternetLinkDto } from './dto/internetLink.dto'
@Injectable()
export class InternetLinkService {

  constructor(
    @InjectRepository(InternetLinkEntity) private readonly internetLinkRepository: Repository<InternetLinkEntity>,
    @InjectRepository(InternetLinkCategoriesEntity) private readonly internetLinkCategoriesRepository: Repository<InternetLinkCategoriesEntity>,
  ) {}

  async findById(id: number) {
    const category = await this.internetLinkRepository.findOne({
      where: {id},
      relations: {
        categories: true
      },
      select: {
        categories: {
          id: true
        }
      }
    })
    if (!category) throw new NotFoundException('Категоия по такому ID не найден!')
    return category
  }

  async findLinkById(id: number) {
    const category = await this.internetLinkCategoriesRepository.findOne({
      where: {id}
    })
    if (!category) throw new NotFoundException('Категоия по такому ID не найден!')
    return category
  }

  async findLinkByCategory(categoryId: number) {
    const links = await this.internetLinkCategoriesRepository.find({
      where: {category: {id: categoryId}},
      order: {
        createdAt: "DESC"
      }
    })
    if (!links) throw new NotFoundException('Данные пусты')
    return links
  }

  async findAll() {
    return await this.internetLinkRepository.find({
      relations: {
        categories: true
      },
      order: {
        createdAt: "DESC"
      },
      select: {
        categories: {
          id: true
        }
      }
    })
  }

  async create(dto: InternetLinkDto) {
    const category = await this.internetLinkRepository.findOneBy({name: dto.name})
    if (category) throw new BadRequestException("Категория уже существует")
    const newData = this.internetLinkRepository.create({...dto})
    return await this.internetLinkRepository.save(newData)
  }

  async update(id: number, dto: InternetLinkDto) {
    const category = await this.findById(id)
    return await this.internetLinkRepository.save({
      ...category,
      ...dto
    })
  }

  async delete(id: number) {
    const category = await this.findById(id)
    if (category.categories.length) throw new BadRequestException('Удаление невозможно. Категория не пуста')
    return await this.internetLinkRepository.delete(id)
  }

  async createLink(id: number, dto: InternetLinkCategoriesDto) {
    const mainCategory = await this.findById(id)
    const link = this.internetLinkCategoriesRepository.create({
      ...dto,
      category: mainCategory
    })
    return await this.internetLinkCategoriesRepository.save(link)
  }

  async updateLink(id: number, dto: InternetLinkCategoriesDto) {
    const link = await this.findLinkById(id)
    return await this.internetLinkCategoriesRepository.save({
      ...link,
      ...dto
    })
  }

  async deleteLink(id: number) {
    return await this.internetLinkCategoriesRepository.delete(id)
  }
}