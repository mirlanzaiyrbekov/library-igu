import { BaseEntity } from "src/utils/base.entity.utils";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { TeachersEntity } from "./teachers.entity";

@Entity({name: "teachers_works"})
export class TeachersWorksEntity extends BaseEntity{
  
  @Column()
  authors: string
  
  @Column({default: null})
  name: string

  @Column({type: "text", nullable: true})
  description?: string

  @Column()
  file: string

  @Column({default: 0})
  downloaded?: number

  @Column({default: 0})
  views?: number

  @ManyToOne(() => TeachersEntity, teachers => teachers.works)
  @JoinColumn({name: "category_id"})
  category: TeachersEntity
}