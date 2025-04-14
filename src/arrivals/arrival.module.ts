import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArrivalController } from "./arrival.controller";
import { ArrivalService } from "./arrival.service";
import { ArrivalEntity } from "./entity/arrival.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ArrivalEntity])
  ],
  controllers: [ArrivalController],
  providers: [ArrivalService]
})
export class ArrivalModule {

}