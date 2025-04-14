import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { deleteFileWithName } from 'src/utils/fileupload.utils';
import { Repository } from 'typeorm';
import { ARRIVAL_GET_UPLOADS_FILES } from './constance/destination.constance';
import { ArrivalDto } from './dto/arrival.dto';
import { ArrivalEntity } from './entity/arrival.entity';

@Injectable()
export class ArrivalService {

  constructor(
    @InjectRepository(ArrivalEntity) private readonly arrivalRepository: Repository<ArrivalEntity>
  ) {}

  async findImageById(id: number) {
    const image = await this.arrivalRepository.findOne({
      where: {id}
    })
    if (!image) throw new NotFoundException("Изображение по такому ID не найден")
    return image
  }

  async findAllimage() {
    return await this.arrivalRepository.find()
  }

  async createImage(dto: ArrivalDto) {
    const data = await this.findAllimage()
    if (data.length > 3) throw new BadRequestException("Максимальн можно создать не больше 4 книг")
    const newData = this.arrivalRepository.create({
      image: `${ARRIVAL_GET_UPLOADS_FILES}/${dto.image}`
    })
    return await this.arrivalRepository.save(newData)
  }

  async updateImage(id: number, dto: ArrivalDto) {
    const data = await this.findImageById(id)
    await deleteFileWithName(data.image)
    return await this.arrivalRepository.save({
      ...data,
      image: `${ARRIVAL_GET_UPLOADS_FILES}/${dto.image}`
    })
  }

  async deleteImage(id: number) {
    const data = await this.findImageById(id)
    await deleteFileWithName(data.image)
    return await this.arrivalRepository.delete(id)
  }
}