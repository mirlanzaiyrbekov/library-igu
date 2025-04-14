import {
	Injectable,
	NotFoundException,
	BadRequestException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate'
import { deleteFileWithName } from 'src/utils/fileupload.utils'
import { FindManyOptions, ILike, Repository } from 'typeorm'
import {
	BOOK_CATEGORY_GET_UPLOADS_FILES,
	BOOK_GET_UPLOADS_FILES,
	BOOK_IMAGE_GET_UPLOADS_FILES,
	BOOK_IMAGE_UPLOADS_FILES
} from './constance/destination'
import {
	BOOK_NOT_FOUND,
	CATEGORY_ALREADY_EXIST,
	CATEGORY_NOT_FOUND,
	MAIN_CATEGORY_ALREADY_EXIST,
	MAIN_CATEGORY_NOT_FOUND
} from './constance/message'
import {
	ElibraryBookDto,
	ElibraryCategoryDto,
	ElibraryDto
} from './dto/elibrary.dto'
import { ElibraryBooksEntity } from './entity/elibrary.books.entity'
import { ElibraryCategoryEntity } from './entity/elibrary.category.enity'
import { ElibraryEntity } from './entity/elibrary.entity'
import { ElibraryRemainingEntity } from './entity/elibrary.remaining.entity'

@Injectable()
export class ElibraryService {
	constructor(
		@InjectRepository(ElibraryEntity)
		private readonly elibraryRepository: Repository<ElibraryEntity>,
		@InjectRepository(ElibraryCategoryEntity)
		private readonly elibraryCategoryRepository: Repository<ElibraryCategoryEntity>,
		@InjectRepository(ElibraryBooksEntity)
		private readonly elibraryBooksRepository: Repository<ElibraryBooksEntity>,
		@InjectRepository(ElibraryRemainingEntity)
		private readonly elibraryRemainingRepository: Repository<ElibraryRemainingEntity>
	) {}

	async findAll() {
		return await this.elibraryRepository.find({
			relations: {
				secondCategory: {
					books: true
				}
			},
			order: {
				id: 'ASC'
			},
			select: {
				secondCategory: {
					id: true,
					name: true,
					books: {
						id: true
					}
				}
			}
		})
	}

	async findAllCategory() {
		return await this.elibraryCategoryRepository.find({
			relations: {
				books: true,
				category: true
			}
		})
	}

	async findCategoryByMainCategory(mainCategoryId: number) {
		const category = await this.elibraryCategoryRepository.find({
			where: {
				category: { id: mainCategoryId }
			},
			relations: {
				books: true,
				category: true
			}
		})
		if (!category) throw new NotFoundException(CATEGORY_NOT_FOUND)
		return category
	}

	async findBooksByCategory(options: IPaginationOptions, categoryId: number) {
		return paginate<ElibraryBooksEntity>(
			this.elibraryBooksRepository,
			options,
			{
				where: {
					category: { id: categoryId }
				},
				relations: {
					category: {
						category: true
					}
				},
				select: {
					category: {
						id: true,
						name: true,
						category: {
							id: true,
							name: true
						}
					}
				},
				order: {
					createdAt: 'DESC'
				}
			}
		)
	}

	async findAllBooks(searchTerm?: string) {
		const searchOptions: FindManyOptions<ElibraryBooksEntity> = {
			relations: {
				category: true
			},
			order: {
				createdAt: 'ASC'
			}
		}
		if (searchTerm) {
			searchOptions.where = [
				{ authors: ILike(`%${searchTerm}%`) },
				{ name: ILike(`%${searchTerm}%`) }
			]
		}
		return await this.elibraryBooksRepository.find(searchOptions)
	}

	async findBookById(id: number) {
		const book = await this.elibraryBooksRepository.findOne({
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
		if (!book) throw new NotFoundException('Книга по такому ID не найден')
		return book
	}

	async findById(id: number) {
		const category = await this.elibraryRepository.findOne({
			where: { id },
			relations: {
				secondCategory: true
			},
			select: {
				id: true,
				name: true
			}
		})
		if (!category) throw new NotFoundException(MAIN_CATEGORY_NOT_FOUND)
		return category
	}

	async findCategoryById(id: number) {
		const category = await this.elibraryCategoryRepository.findOne({
			where: { id },
			relations: {
				books: true
			},
			select: {
				books: {
					id: true
				}
			}
		})
		if (!category) throw new NotFoundException(CATEGORY_NOT_FOUND)
		return category
	}

	async create(dto: ElibraryDto, file: string) {
		const category = await this.elibraryRepository.findOne({
			where: { name: dto.name }
		})
		if (category) throw new BadRequestException(MAIN_CATEGORY_ALREADY_EXIST)
		const newData = this.elibraryRepository.create({
			...dto,
			image: `${BOOK_CATEGORY_GET_UPLOADS_FILES}/${file}`
		})
		return await this.elibraryRepository.save(newData)
	}

	async update(id: number, dto: ElibraryDto, file: string) {
		const category = await this.findById(id)
		await deleteFileWithName(category.image)
		return await this.elibraryRepository.save({
			...category,
			...dto,
			image: `${BOOK_CATEGORY_GET_UPLOADS_FILES}/${file}`
		})
	}

	async deleteMainCategory(id: number) {
		const category = await this.findById(id)
		if (category.secondCategory.length)
			throw new BadRequestException(
				'Удаление невозможно, так как категория содержит материалы. Это приведет к не стабильной работе API'
			)
		await deleteFileWithName(category.image)
		return await this.elibraryRepository.delete(id)
	}

	async createCategory(mainCategoryId: number, dto: ElibraryCategoryDto) {
		const category = await this.elibraryCategoryRepository.findOne({
			where: { name: dto.name }
		})
		if (category) throw new BadRequestException(CATEGORY_ALREADY_EXIST)
		const mainCategory = await this.findById(mainCategoryId)
		const newData = this.elibraryCategoryRepository.create({
			...dto,
			category: mainCategory
		})
		return await this.elibraryCategoryRepository.save(newData)
	}

	async updateCategory(id: number, dto: ElibraryCategoryDto) {
		const category = await this.findCategoryById(id)
		return await this.elibraryCategoryRepository.save({
			...category,
			...dto
		})
	}

	async deleteCategory(id: number) {
		const category = await this.findCategoryById(id)
		if (category.books.length)
			throw new BadRequestException(
				'Удаление невозможно, так как категория содержит материалы. Это приведет к не стабильной работе API'
			)
		return await this.elibraryCategoryRepository.delete(id)
	}

	async createBook(categoryId: number, dto: ElibraryBookDto, file: string) {
		const category = await this.findCategoryById(categoryId)
		const newData = this.elibraryBooksRepository.create({
			...dto,
			category,
			file: `${BOOK_GET_UPLOADS_FILES}/${file}`
		})
		return await this.elibraryBooksRepository.save(newData)
	}

	async updateBook(id: number, dto: ElibraryBookDto, file: string) {
		const book = await this.elibraryBooksRepository.findOne({ where: { id } })
		if (!book) throw new NotFoundException(BOOK_NOT_FOUND)
		await deleteFileWithName(book.file)
		return await this.elibraryBooksRepository.save({
			...book,
			...dto,
			file: `${BOOK_GET_UPLOADS_FILES}/${file}`
		})
	}

	async deleteBook(id: number) {
		const book = await this.elibraryBooksRepository.findOne({ where: { id } })
		await deleteFileWithName(book.file)
		return await this.elibraryBooksRepository.delete(id)
	}

	async updateBookView(id: number) {
		const book = await this.findBookById(id)
		book.views++
		return await this.elibraryBooksRepository.save(book)
	}

	async createElibraryRemaining(image: string) {
		const books = await this.elibraryRemainingRepository.find()
		if (books.length > 5)
			throw new BadRequestException(
				'Максимально можно создать не больше 6 блоков'
			)
		const newData = this.elibraryRemainingRepository.create({
			image: `${BOOK_IMAGE_GET_UPLOADS_FILES}/${image}`
		})
		return await this.elibraryRemainingRepository.save(newData)
	}

	async updateElibraryRemaining(id: number, image: string) {
		const book = await this.elibraryRemainingRepository.findOne({
			where: { id }
		})
		if (!book)
			throw new BadRequestException('Изображение по такому ID не найден')
		await deleteFileWithName(book.image)
		return await this.elibraryRemainingRepository.save({
			...book,
			image: `${BOOK_IMAGE_GET_UPLOADS_FILES}/${image}`
		})
	}

	async deleteElibraryRemaining(id: number) {
		const book = await this.elibraryRemainingRepository.findOne({
			where: { id }
		})
		await deleteFileWithName(book.image)
		return await this.elibraryRemainingRepository.delete(id)
	}

	async findAllRemaining() {
		return await this.elibraryRemainingRepository.find({
			order: {
				createdAt: 'DESC'
			}
		})
	}
}
