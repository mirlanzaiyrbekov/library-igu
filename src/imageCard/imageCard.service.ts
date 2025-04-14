import {Injectable, NotFoundException, BadRequestException} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { deleteFileWithName } from 'src/utils/fileupload.utils';
import { Repository } from 'typeorm';
import { IMAGECARD_GET_UPLOADS_FILES } from './constance/destination.constance';
import { ImageCardDto } from './dto/imageCard.dto';
import { ImageCardEntity } from './entity/imageCard.entity';


@Injectable()
export class ImageCardService {

  constructor(
    @InjectRepository(ImageCardEntity) private readonly imageCardRepository: Repository<ImageCardEntity>
  ) {}

  async findAll() {
    return await this.imageCardRepository.find({
      order: {
        id: "ASC"
      }
    })
  }

  async findById(id: number) {
    const card = await this.imageCardRepository.findOne({
      where: {id}
    })
    if (!card) throw new NotFoundException("ImageCard по такому ID не найден")
    return card
  }

  async create(dto: ImageCardDto, file: string) {
    const cards = await this.findAll()
    if (cards.length > 1) throw new BadRequestException("Максимально можно создать до 2 блоков")
    const newData = this.imageCardRepository.create({
      ...dto,
      image: `${IMAGECARD_GET_UPLOADS_FILES}/${file}`
    })
    return await this.imageCardRepository.save(newData)
  }

  async update(id: number, dto: ImageCardDto, file: string) {
    const card = await this.findById(id)
    await deleteFileWithName(card.image)
    return await this.imageCardRepository.save({
      ...card,
      ...dto,
      image: `${IMAGECARD_GET_UPLOADS_FILES}/${file}`
    })
  }

}