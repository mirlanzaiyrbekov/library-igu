import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGE_NOT_FOUND } from 'src/page/constance/page.message.constance';
import { PageEntity } from 'src/page/entity/page.entity';
import { deleteFileWithName } from 'src/utils/fileupload.utils';
import { Repository } from 'typeorm';
import { JOURNAL_GET_UPLOADS } from './constance/desintation.constance';
import { JOURNAL_HEAD_ITEMS_NOT_FOUND, JOURNAL_HEAD_NOT_FOUND, JOURNAL_NOT_FOUND } from './constance/message.constace';
import { IJournalCreateDto } from './dto/journal.create.dto';
import { JournalDto } from './dto/journal.dto';
import { JournalHeadDto } from './dto/journal.head.dto';
import { JournalHeadItemsDto } from './dto/journal.headItem.dto';
import { JournalEntity } from './entity/journal.entity';
import { JournalHeadEntity } from './entity/journal.head.entity';
import { JournalHeadItemsEntity } from './entity/journal.headItems.entity';

@Injectable()
export class JournalService {

  constructor(
    @InjectRepository(JournalEntity) private readonly journalRepository: Repository<JournalEntity>,
    @InjectRepository(JournalHeadEntity) private readonly journalHeadRepository: Repository<JournalHeadEntity>,
    @InjectRepository(JournalHeadItemsEntity) private readonly journalHeadItemsRepository: Repository<JournalHeadItemsEntity>,
    @InjectRepository(PageEntity) private readonly pageRepository: Repository<PageEntity>
  ) {}

  async findJournalById(id: number) {
    const journal = await this.journalRepository.findOne({
      where: {id},
      relations: {
        journalHead: {
          journal: true,
          items: {
            journal_head: true
          }
        }
      },
      order: {
        journalHead: {
          id: "DESC",
          items: {
            id: "DESC"
          }
        }
      }
    })
    if (!journal) throw new NotFoundException(JOURNAL_NOT_FOUND)
    return journal
  }

  async findJournalHeadById(id: number) {
    const journalHead = await this.journalHeadRepository.findOne({
      where: {id}
    })
    if (!journalHead) throw new NotFoundException(JOURNAL_HEAD_NOT_FOUND)
    return journalHead
  }

  async findJournalHeadItemsById(id: number) {
    const journalHeadItems = await this.journalHeadItemsRepository.findOne({
      where: {id}
    })
    if (!journalHeadItems) throw new NotFoundException(JOURNAL_HEAD_ITEMS_NOT_FOUND)
    return journalHeadItems
  }

  async createJournal(pageId: number, dto: IJournalCreateDto) {
    const page = await this.pageRepository.findOne({where: {id: pageId}})
    if (!page) throw new NotFoundException(PAGE_NOT_FOUND)

    const newData = this.journalRepository.create({
      ...dto,
      image: `${JOURNAL_GET_UPLOADS}/${dto.image}`,
      page
    })
    return await this.journalRepository.save(newData)
  }

  async updateJournal(id: number, dto: JournalDto) {
    const journal = await this.findJournalById(id)
    return await this.journalRepository.save({
      ...journal,
      ...dto
    })
  }

  async deleteJournal(id: number) {
    return await this.journalRepository.delete(id)
  }

  async updateJournalImage(id: number, file: string) {
    const journal = await this.findJournalById(id)
    await deleteFileWithName(journal.image)
    return await this.journalRepository.save({
      ...journal,
      image: `${JOURNAL_GET_UPLOADS}/${file}`
    })
  }

  async createJournalHead(journalId: number, dto: JournalHeadDto) {
    const journal = await this.findJournalById(journalId)
    const newData = this.journalHeadRepository.create({
      ...dto,
      journal
    })
    return await this.journalHeadRepository.save(newData)
  }

  async updateJournalHead(id: number, dto: JournalHeadDto) {
    const journalHead = await this.findJournalHeadById(id)
    return await this.journalHeadRepository.save({
      ...journalHead,
      ...dto
    })
  }

  async createJournalHeadItems(journalHeadId: number, dto: JournalHeadItemsDto) {
    const journalHead = await this.findJournalHeadById(journalHeadId)
    const newData = this.journalHeadItemsRepository.create({
      ...dto,
      journal_head: journalHead
    })
    return await this.journalHeadItemsRepository.save(newData)
  }

  async updateJournalHeadItems(id: number, dto: JournalHeadItemsDto) {
    const journalHead = await this.findJournalHeadItemsById(id)
    return await this.journalHeadItemsRepository.save({
      ...journalHead,
      ...dto
    })
  }
}
