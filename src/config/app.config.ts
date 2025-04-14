import { ConfigService } from '@nestjs/config'

export const getAppConfig = async (configService: ConfigService) => {
	const PORT = await configService.get('APP_PORT')
	return {
		PORT
	}
}
