import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeachersEntity } from "./entity/teachers.entity";
import { TeachersWorksEntity } from "./entity/teachers.works.entity";
import { TeachersController } from "./teachers.controller";
import { TeachersService } from "./teachers.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([TeachersEntity, TeachersWorksEntity])
  ],
  controllers: [TeachersController],
  providers: [TeachersService]
})
export class TeachersModule{}