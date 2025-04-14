import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Injectable } from '@nestjs/common/decorators'
import { InjectRepository } from '@nestjs/typeorm'
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate'
import { deleteFileWithName } from 'src/utils/fileupload.utils'
import { FindManyOptions, ILike, Repository } from 'typeorm'
import { WORK_GET_UPLOADS_FILES } from './constance/destination.constance'
import { TeachersDto } from './dto/teachers.dto'
import { TeachersWorkDto } from './dto/teachers.work.dto'
import { TeachersEntity } from './entity/teachers.entity'
import { TeachersWorksEntity } from './entity/teachers.works.entity'

@Injectable()
export class TeachersService {
	constructor(
		@InjectRepository(TeachersEntity)
		private readonly teachersRepository: Repository<TeachersEntity>,
		@InjectRepository(TeachersWorksEntity)
		private readonly teachersWorksRepository: Repository<TeachersWorksEntity>
	) {}

	async create(dto: TeachersDto) {
		const category = await this.findOneByName(dto.name)
		if (category)
			throw new BadRequestException('Данная категория уже существует')
		const newData = this.teachersRepository.create({
			...dto
		})
		return await this.teachersRepository.save(newData)
	}

	async update(id: number, dto: TeachersDto) {
		const category = await this.findOne(id)
		const newData = this.teachersRepository.save({
			...category,
			...dto
		})
		return newData
	}

	async delete(id: number) {
		const category = await this.findOne(id)
		if (category.works.length)
			throw new BadRequestException(
				'Удаление невозможно, так как категория содержит материалы. Это приведет к не стабильной работе API'
			)
		return await this.teachersRepository.delete(id)
	}

	async findOne(id: number) {
		const category = await this.teachersRepository.findOne({
			where: { id },
			relations: {
				works: true
			},
			select: {
				id: true,
				name: true,
				description: true,
				createdAt: true,
				works: {
					id: true
				}
			}
		})
		if (!category)
			throw new NotFoundException('Категория по такому ID не найден')
		return category
	}

	async findOneByName(name: string) {
		const category = await this.teachersRepository.findOne({
			where: { name }
		})
		return category
	}

	async findAll() {
		return await this.teachersRepository.find({
			relations: {
				works: true
			},
			order: {
				createdAt: 'ASC'
			},
			select: {
				works: {
					id: true
				}
			}
		})
	}

	async createWork(id: number, dto: TeachersWorkDto, file: string) {
		const category = await this.findOne(id)
		const newWork = this.teachersWorksRepository.create({
			...dto,
			file: `${WORK_GET_UPLOADS_FILES}/${file}`,
			category: category
		})
		return await this.teachersWorksRepository.save(newWork)
	}

	async updateWork(id: number, dto: TeachersWorkDto, file: string) {
		const work = await this.findOneWork(id)
		await deleteFileWithName(work.file)
		return await this.teachersWorksRepository.save({
			...work,
			...dto,
			file: `${WORK_GET_UPLOADS_FILES}/${file}`
		})
	}

	async deleteWork(id: number) {
		const work = await this.findOneWork(id)
		await deleteFileWithName(work.file)
		return await this.teachersWorksRepository.delete(id)
	}

	async findOneWork(id: number) {
		const work = await this.teachersWorksRepository.findOne({
			where: { id }
		})
		if (!work) throw new NotFoundException('Статья с таким ID не найден')
		return work
	}

	async findWorkByCategory(options: IPaginationOptions, categoryId: number) {
		return paginate<TeachersWorksEntity>(
			this.teachersWorksRepository,
			options,
			{
				where: { category: { id: categoryId } },
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
					createdAt: 'DESC'
				}
			}
		)
	}

	async findAllWork(searchTerm?: string) {
		const searchOptions: FindManyOptions<TeachersWorksEntity> = {
			relations: {
				category: true
			},
			order: {
				createdAt: 'ASC'
			}
		}
		if (searchTerm) {
			searchOptions.where = {
				authors: ILike(`%${searchTerm}%`)
			}
		}
		return await this.teachersWorksRepository.find(searchOptions)
	}

	async findWorksLimit(limit: number) {
		return await this.teachersWorksRepository.find({
			relations: {
				category: true
			},
			take: limit,
			order: {
				createdAt: 'ASC'
			}
		})
	}

	async updateWorksView(id: number) {
		const work = await this.findOneWork(id)
		work.views++
		return await this.teachersWorksRepository.save(work)
	}

	async updateWorksDownloaded(id: number) {
		const work = await this.findOneWork(id)
		work.downloaded++
		return await this.teachersWorksRepository.save(work)
	}
}
