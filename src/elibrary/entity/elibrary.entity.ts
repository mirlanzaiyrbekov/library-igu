import { BaseEntity } from "src/utils/base.entity.utils";
import { Column, Entity, OneToMany } from "typeorm";
import { ElibraryCategoryEntity } from "./elibrary.category.enity";

@Entity({name: "elibrary"})
export class ElibraryEntity extends BaseEntity {
  
  @Column({name: "main_category",unique: true})
  name: string

  @Column()
  image: string
  
  @OneToMany(() => ElibraryCategoryEntity, scat => scat.category)
  secondCategory: ElibraryCategoryEntity[]
}