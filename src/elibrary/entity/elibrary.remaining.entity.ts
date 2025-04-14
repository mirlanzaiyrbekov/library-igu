import { BaseEntity } from "src/utils/base.entity.utils";
import { Column, Entity } from "typeorm";

@Entity({name: "elibrary_remaining"})
export class ElibraryRemainingEntity extends BaseEntity {
  
  @Column()
  image: string
}