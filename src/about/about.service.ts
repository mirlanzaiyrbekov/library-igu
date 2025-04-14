import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { deleteFileWithName } from 'src/utils/fileupload.utils';
import { Repository } from 'typeorm';
import { ABOUT_INFO_GET_UPLOADS_FILES, OWNER_GET_UPLOADS_FILES } from './constance/destination.constance';
import { AboutInfoDto, AboutOwnerDto, AboutTabloDto } from './dto/about.dto';
import { AboutInformationEntity } from './entity/about.information.entity';
import { AboutOwnerEntity } from './entity/about.owner.entity';
import { AboutTabloEntity } from './entity/about.tablo.entity';

@Injectable()
export class AboutService {

  constructor(
    @InjectRepository(AboutInformationEntity) private readonly aboutInformationRepository: Repository<AboutInformationEntity>,
    @InjectRepository(AboutOwnerEntity) private readonly aboutOwnerRepository: Repository<AboutOwnerEntity>,
    @InjectRepository(AboutTabloEntity) private readonly aboutTabloRepository: Repository<AboutTabloEntity>,
  ) {}

  async createOwner(dto: AboutOwnerDto, file: string) {
    const owner = await this.aboutOwnerRepository.find()
    if (owner.length) throw new NotFoundException("Невозможно создать.")
    const newData = this.aboutOwnerRepository.create({
      ...dto,
      image: `${OWNER_GET_UPLOADS_FILES}/${file}`
    })
    return await this.aboutOwnerRepository.save(newData)
  }

  async updateOwner(id: number, dto: AboutOwnerDto, file: string) {
    const owner = await this.aboutOwnerRepository.findOne({where: {id}})
    await deleteFileWithName(owner.image)
    return await this.aboutOwnerRepository.save({
      ...owner,
      ...dto,
      image: `${OWNER_GET_UPLOADS_FILES}/${file}`
    })
  }

  async findOwner() {
    return await this.aboutOwnerRepository.find()
  }

  async findAboutInfo() {
    return await this.aboutInformationRepository.find({
      order: {
        id: "ASC"
      }
    })
  }

  async findAboutInfoById(id: number) {
    const info = await this.aboutInformationRepository.findOne({
      where: {id}
    })
    if (!info) throw new NotFoundException("Информация по такому ID не найден")
    return info
  }

  async createAboutInfo(dto: AboutInfoDto, file?: string) {
    if (!file?.length) {
      const newData = this.aboutInformationRepository.create({
        ...dto
      })
      return await this.aboutInformationRepository.save(newData)
    } else {
      const newData = this.aboutInformationRepository.create({
        ...dto,
        image: `${ABOUT_INFO_GET_UPLOADS_FILES}/${file}`
      })
      return await this.aboutInformationRepository.save(newData)
    }
  }

  async updateAboutInfo(id: number, dto: AboutInfoDto, file?: string) {
    const aboutInfo = await this.aboutInformationRepository.findOne({where: {id}})
    if (!aboutInfo) throw new NotFoundException("Данные по такому ID не найден")
    if (file?.length) {
      await deleteFileWithName(aboutInfo.image)
      await this.aboutInformationRepository.save({
        ...aboutInfo,
        ...dto,
        image: `${ABOUT_INFO_GET_UPLOADS_FILES}/${file}`
      })
    } else {
      return await this.aboutInformationRepository.save({
        ...aboutInfo,
        ...dto
      })
    }
  }

  async findAboutTablo() {
    return await this.aboutTabloRepository.find()
  }

  async createAboutTablo(dto: AboutTabloDto) {
    const newData = this.aboutTabloRepository.create({
      ...dto
    })
    return await this.aboutTabloRepository.save(newData)
  }

  async updateAboutTablo(id: number, dto: AboutTabloDto) {
    const tablo = await this.aboutTabloRepository.findOne({
      where: {id}
    })
    if (!tablo) throw new NotFoundException("Табло по такому ID не найден")
    return await this.aboutTabloRepository.save({
      ...tablo,
      ...dto
    })
  }
}
