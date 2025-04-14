import { BaseEntity } from "src/utils/base.entity.utils";
import { Column, Entity } from "typeorm";

@Entity({name: "arrival"})
export class ArrivalEntity extends BaseEntity{
  
  @Column()
  image: string
}