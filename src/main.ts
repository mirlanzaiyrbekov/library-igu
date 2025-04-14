import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

const PORT = process.env.APP_PORT || 4200

const start = async () => {
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('api/v2')
	app.enableCors({
		origin: ['https://dashboard.libraryiksu.kg', 'https://libraryiksu.kg', 'http://localhost:3000'],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		allowedHeaders: 'Content-Type, Accept, Authorization'
	})
	await app.listen(PORT)
}
start()
