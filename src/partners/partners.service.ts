import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { deleteFileWithName } from 'src/utils/fileupload.utils';
import { Repository } from 'typeorm';
import { PARTNERS_GET_UPLOADS_FILES } from './constance/destination.constance';
import { PartnersDto } from './dto/partners.dto';
import { PartnersEntity } from './entity/partners.entity';

@Injectable()
export class PartnersService {

  constructor(
    @InjectRepository(PartnersEntity) private readonly partnersRepository: Repository<PartnersEntity>
  ) {}

  async findAllPartners() {
    return await this.partnersRepository.find()
  }

  async create(dto: PartnersDto) {
    const partner = this.partnersRepository.create({
      ...dto,
      image: `${PARTNERS_GET_UPLOADS_FILES}/${dto.image}`
    })
    return await this.partnersRepository.save(partner)
  }

  async update(id: number, dto: PartnersDto) {
    const partner = await this.partnersRepository.findOne({where: {id}})
    await deleteFileWithName(partner.image)
    return await this.partnersRepository.save({
      ...partner,
      ...dto,
      image: `${PARTNERS_GET_UPLOADS_FILES}/${dto.image}`
    })
  }

  async delete(id: number) {
    const partner = await this.partnersRepository.findOne({where: {id}})
    await deleteFileWithName(partner.image)
    return await this.partnersRepository.delete(id)
  }
}
