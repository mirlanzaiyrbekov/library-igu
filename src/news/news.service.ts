import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate'
import { deleteFileWithName } from 'src/utils/fileupload.utils'
import { Repository } from 'typeorm'
import { NEWS_GET_UPLOADS_FILES } from './constance/destination.constance'
import { NewsDto } from './dto/news.dto'
import { NewsEntity } from './entity/news.entity'

@Injectable()
export class NewsService {
	constructor(
		@InjectRepository(NewsEntity)
		private readonly newsRepository: Repository<NewsEntity>
	) {}

	async create(dto: NewsDto, file: string) {
		const newData = this.newsRepository.create({
			...dto,
			image: `${NEWS_GET_UPLOADS_FILES}/${file}`
		})
		return await this.newsRepository.save(newData)
	}

	async update(id: number, dto: NewsDto, file: string) {
		const news = await this.findOne(id)
		await deleteFileWithName(news.image)
		return await this.newsRepository.save({
			...news,
			...dto,
			image: `${NEWS_GET_UPLOADS_FILES}/${file}`
		})
	}

	async delete(id: number) {
		const news = await this.findOne(id)
		await deleteFileWithName(news.image)
		return await this.newsRepository.delete(id)
	}

	async findOne(id: number) {
		const news = await this.newsRepository.findOne({ where: { id } })
		if (!news) throw new NotFoundException('Новость по такому ID не найдена')
		return news
	}

	async findAllWithPaginate(options: IPaginationOptions) {
		return paginate<NewsEntity>(this.newsRepository, options, {
			order: {
				createdAt: 'DESC'
			}
		})
	}

	async findAllNews() {
		return await this.newsRepository.find({
			order: {
				createdAt: 'DESC'
			}
		})
	}

	async findNewsByLimit(limit: number) {
		return await this.newsRepository.find({
			take: limit,
			order: {
				createdAt: 'DESC'
			}
		})
	}
}
