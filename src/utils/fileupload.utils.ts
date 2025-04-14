import { HttpException, HttpStatus, Request } from '@nestjs/common'
import * as fs from 'fs'
import { extname } from 'path'

export const imageFileFilter = (req, file: Express.Multer.File, callback) => {
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
		return callback(
			new HttpException(
				'Поддерживаемые форматы изображений png, jpg, jpeg, gif',
				HttpStatus.BAD_REQUEST
			),
			false
		)
	}
	callback(null, true)
}
export const fileFileFilter = (req, file: Express.Multer.File, callback) => {
	if (!file.originalname.match(/\.(pdf|word)$/)) {
		return callback(
			new HttpException(
				'Поддерживаемые форматы файлов .pdf, .word',
				HttpStatus.BAD_REQUEST
			),
			false
		)
	}
	callback(null, true)
}
export const filesFileFilter = (req, file: Express.Multer.File, callback) => {
	if (!file.originalname.match(/\.(pdf)$/)) {
		return callback(
			new HttpException(
				'Для ссылочных типов файлов, поддерживаются форматы только PDF',
				HttpStatus.BAD_REQUEST
			),
			false
		)
	}
	callback(null, true)
}
export const renameFIleName = (req, file, cb) => {
	const name = file.originalname.split('.')[0]
	const fileExtName = extname(file.originalname)
	const randomName = Array(4)
		.fill(null)
		.map(() => Math.round(Math.random() * 10).toString(10))
		.join('')
	cb(null, `${name}${randomName}${fileExtName}`)
}

export const deleteFileWithName = async (fileName: string) => {
	try {
		fs.unlink(
			`./uploads/${fileName}`,
			(err) => new HttpException('Файл не найден', HttpStatus.NOT_FOUND)
		)
	} catch (e) {
		return new HttpException(
			`Произошла ошибка при удаление файла ${fileName}`,
			HttpStatus.SERVICE_UNAVAILABLE
		)
	}
}
