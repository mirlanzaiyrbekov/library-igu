import {Injectable, NotFoundException, BadRequestException} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { WindowEntity } from './entity/window.entity';
import { Repository } from 'typeorm';
import { WindowCategoryEntity } from './entity/window.category.entity';
import { MainCategoryDto } from './dto/windowMainCategory.dto';
import { WindowCategoryDto } from './dto/window.category.dto';
import { WINDOW_GET_UPLOADS } from './constance/destination.constance';
import { deleteFileWithName } from 'src/utils/fileupload.utils';

@Injectable()
export class WindowService {

  constructor(
    @InjectRepository(WindowEntity) private readonly windowRepository: Repository<WindowEntity>,
    @InjectRepository(WindowCategoryEntity) private readonly windowCategoryRepository: Repository<WindowCategoryEntity>
  ) {}

  async findAllMainCategories() {
    const categories = await this.windowRepository.find({
      relations: {
        category: true
      },
      order: {
        createdAt: "DESC"
      }
    })
    if (!categories) throw new NotFoundException("Категории пусты")
    return categories
  }

  async findMainCategoryById(id: number) {
    const category = await this.windowRepository.findOne({
      where: {id},
      relations: {
        category: true
      }
    })
    if (!category) throw new NotFoundException("Категория по такому ID не найден. Повторите запрос")
    return category
  }

  async findAllSecondCategories() {
    const categories = await this.windowCategoryRepository.find({
      order: {
        createdAt: "ASC"
      }
    })
    if (!categories) throw new NotFoundException("Категории пусты")
    return categories
  }

  async findSecondCategoryById(id: number) {
    const category = await this.windowCategoryRepository.findOne({
      where: {id},
    })
    if (!category) throw new NotFoundException("Подкатегория по такому ID не найден")
    return category
  }

  async findSecondCategoryByMainCategory(categoryId: number) {
    const category = await this.windowCategoryRepository.find({
      where: {category: {id: categoryId}}
    })
    if (!category) throw new NotFoundException("Подкатегория по такому ID не найден")
    return category
  }

  async createMainCategory(dto: MainCategoryDto) {
    const category = await this.windowRepository.findOneBy({name: dto.name})
    if (category) throw new BadRequestException("Данная категория уже существует")
    const newData = this.windowRepository.create({
      ...dto
    })
    return await this.windowRepository.save(newData)
  }

  async updateMainCategory(id: number, dto: MainCategoryDto) {
    const category = await this.findMainCategoryById(id)
    return await this.windowRepository.save({
      ...category,
      ...dto
    })
  }

  async createSecondCategory(categiryId: number, dto: WindowCategoryDto, file: string) {
    const category = await this.findMainCategoryById(categiryId)
    const secondCategory = this.windowCategoryRepository.create({
      ...dto,
      file: `${WINDOW_GET_UPLOADS}/${file}`,
      category
    })
    return await this.windowCategoryRepository.save(secondCategory)
  }

  async updateSecondCategory(id: number, dto: WindowCategoryDto, file: string) {
    const category = await this.findSecondCategoryById(id)
    await deleteFileWithName(category.file)
    return await this.windowCategoryRepository.save({
      ...category,
      ...dto,
      file: `${WINDOW_GET_UPLOADS}/${file}`
    })
  }

  async deleteMainCategory(id: number) {
    const category = await this.findMainCategoryById(id)
    if (category.category.length) throw new BadRequestException("Удаление невозможно, так как категория содержит подкатегории!")
    return this.windowRepository.delete(id)
  }

  async deleteSecondCategory(id: number) {
    const category = await this.findSecondCategoryById(id)
    await deleteFileWithName(category.file)
    return await this.windowCategoryRepository.delete(id)
  }

}