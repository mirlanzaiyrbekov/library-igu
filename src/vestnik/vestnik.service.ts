import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PAGE_NOT_FOUND } from 'src/page/constance/page.message.constance'
import { PageEntity } from 'src/page/entity/page.entity'
import { deleteFileWithName } from 'src/utils/fileupload.utils'
import { FindManyOptions, ILike, Repository } from 'typeorm'
import { VESTNIK_GET_UPLOADS_IMAGE } from './constance/destination.constance'
import {
	VESTNIK_ALL_NOT_FOUND,
	VESTNIK_NOT_FOUND
} from './constance/message.constance'
import { IVestnikDto } from './dto/vestnik.dto'
import { IVestnikMaterialDto } from './dto/vestnik.material.dto'
import { VestnikEntity } from './entity/vestnik.entity'
import { VestnikMaterialEntity } from './entity/vestnik.material.entity'
import {
	paginate,
	Pagination,
	IPaginationOptions
} from 'nestjs-typeorm-paginate'

@Injectable()
export class VestnikService {
	constructor(
		@InjectRepository(VestnikEntity)
		private readonly vestnikRepository: Repository<VestnikEntity>,
		@InjectRepository(VestnikMaterialEntity)
		private readonly vestnikMaterialRepository: Repository<VestnikMaterialEntity>,
		@InjectRepository(PageEntity)
		private readonly pageRepository: Repository<PageEntity>
	) {}

	async findVestnikById(id: number) {
		const vestnik = await this.vestnikRepository.findOne({
			where: { id },
			relations: {
				materials: true
			},
			select: {
				materials: { id: true }
			},
			order: {
				createdAt: 'DESC'
			}
		})
		if (!vestnik) throw new NotFoundException(VESTNIK_NOT_FOUND)
		return vestnik
	}
	async findAllVestnik() {
		const vestnik = await this.vestnikRepository.find({
			relations: {
				materials: true
			},
			order: {
				createdAt: 'ASC'
			},
			select: {
				materials: {
					id: true
				}
			}
		})
		if (!vestnik) throw new NotFoundException(VESTNIK_ALL_NOT_FOUND)
		return vestnik
	}

	async findVestnikMaterialsById(id: number) {
		const material = await this.vestnikMaterialRepository.findOne({
			where: { id },
			relations: {
				category: true
			},
			select: {
				category: {
					id: true,
					name: true
				}
			}
		})
		if (!material)
			throw new NotFoundException('Материал не найден по такому ID')
		return material
	}

	async findVestnikMaterials(searchTerm?: string) {
		const searchOptions: FindManyOptions<VestnikMaterialEntity> = {
			relations: {
				category: true
			},
			select: {
				category: {
					id: true,
					name: true
				}
			}
		}
		if (searchTerm) {
			searchOptions.where = [
				{ authors: ILike(`%${searchTerm}%`) },
				{ name: ILike(`%${searchTerm}%`) }
			]
		}
		return await this.vestnikMaterialRepository.find(searchOptions)
	}

	async findMaterialsByCategory(
		options: IPaginationOptions,
		id: number
	): Promise<Pagination<VestnikMaterialEntity>> {
		return paginate<VestnikMaterialEntity>(
			this.vestnikMaterialRepository,
			options,
			{
				where: { category: { id } },
				relations: {
					category: true
				},
				select: {
					category: {
						id: true,
						name: true
					}
				},
				order: {
					id: 'ASC'
				}
			}
		)
	}

	async create(pageId: number, dto: IVestnikDto) {
		const page = await this.pageRepository.findOne({ where: { id: pageId } })
		if (!page) throw new NotFoundException(PAGE_NOT_FOUND)
		const newData = this.vestnikRepository.create({
			...dto,
			page
		})
		return await this.vestnikRepository.save(newData)
	}

	async update(id: number, dto: IVestnikDto) {
		const vestnik = await this.findVestnikById(id)
		return await this.vestnikRepository.save({
			...vestnik,
			...dto
		})
	}

	async createMaterial(
		vestnikId: number,
		dto: IVestnikMaterialDto,
		file: string
	) {
		const vestnik = await this.findVestnikById(vestnikId)
		const newData = this.vestnikMaterialRepository.create({
			...dto,
			file: `${VESTNIK_GET_UPLOADS_IMAGE}/${file}`,
			category: vestnik
		})
		return await this.vestnikMaterialRepository.save(newData)
	}

	async updateMaterial(id: number, dto: IVestnikMaterialDto, file: string) {
		const material = await this.findVestnikMaterialsById(id)
		await deleteFileWithName(material.file)
		return await this.vestnikMaterialRepository.save({
			...material,
			...dto,
			file: `${VESTNIK_GET_UPLOADS_IMAGE}/${file}`
		})
	}

	async deleteVestnik(id: number) {
		const vestnik = await this.findVestnikById(id)
		if (vestnik.materials.length)
			throw new BadRequestException(
				'Удаление невозможно, есть вложенные материалы'
			)
		return await this.vestnikRepository.delete(id)
	}

	async deleteMaterial(id: number) {
		const material = await this.vestnikMaterialRepository.findOne({
			where: { id }
		})
		await deleteFileWithName(material.file)
		return await this.vestnikMaterialRepository.delete(id)
	}

	async updateMaterialViews(id: number) {
		const material = await this.findVestnikMaterialsById(id)
		material.views++
		return await this.vestnikMaterialRepository.save(material)
	}

	async updateMaterialDownload(id: number) {
		const material = await this.findVestnikMaterialsById(id)
		material.downloaded++
		return await this.vestnikMaterialRepository.save(material)
	}
}
