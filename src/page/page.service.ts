import {
	Injectable,
	NotFoundException,
	BadRequestException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import {
	PAGE_ALREADY,
	PAGE_NOT_FOUND
} from './constance/page.message.constance'
import { PageDto } from './dto/page.dto'
import { PageEntity } from './entity/page.entity'

@Injectable()
export class PageService {
	constructor(
		@InjectRepository(PageEntity)
		private readonly pageRepository: Repository<PageEntity>
	) {}

	/**
	 * @description GET PAGE BY ID
	 * @param id
	 * @returns
	 */
	async getById(id: number) {
		const page = await this.pageRepository.findOne({
			where: { id },
			relations: {
				hero: {
					subcontent: true,
					page: true
				},
				journal: {
					journalHead: {
						items: true
					}
				},
				tabs: {
					isLink: true
				}
			},
			order: {
				createdAt: 'DESC',
				journal: {
					journalHead: {
						id: 'ASC',
						items: {
							id: 'ASC'
						}
					}
				},
				tabs: {
					id: 'DESC',
					isLink: {
						updatedAt: 'DESC'
					}
				}
			},
			select: {
				hero: true,
				journal: true,
				vestnik: {
					id: true,
					createdAt: true,
					updatedAt: true,
					name: true,
					materials: {
						id: true
					},
					page: {
						name: true,
						id: true
					}
				}
			}
		})
		if (!page) throw new NotFoundException(PAGE_NOT_FOUND)
		return page
	}

	async getAllPages() {
		return await this.pageRepository.find({
			relations: {
				hero: {
					subcontent: {
						hero: true
					}
				},
				journal: true
			},
			select: {
				hero: {
					background: true,
					title: true,
					page: {
						name: true
					},
					subcontent: {
						hero: {
							id: true
						}
					}
				}
			},
			order: {
				updatedAt: 'ASC'
			}
		})
	}

	/**
	 * @param dto
	 */
	async createPage(dto: PageDto) {
		const page = await this.pageRepository.findOne({
			where: { name: dto.name }
		})
		if (!page) {
			const newData = this.pageRepository.create(dto)
			return await this.pageRepository.save(newData)
		}
		throw new BadRequestException(PAGE_ALREADY)
	}

	/**
	 * @param id
	 * @param dto
	 * @returns
	 */
	async updatePage(id: number, dto: PageDto) {
		const page = await this.getById(id)

		return await this.pageRepository.save({
			...page,
			...dto
		})
	}

	async deletePage(id: number) {
		return await this.pageRepository.delete(id)
	}
}
