import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const getTypeOrmConfig = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
  type: "postgres",
  host: configService.get("DATABASE_HOST"),
  port: configService.get("DATABASE_PORT"),
  database: configService.get("DATABASE"),
  username: configService.get("DATABASE_USER"),
  password: configService.get("DATABASE_PASSWORD"),
  autoLoadEntities: true,
  synchronize: true
})