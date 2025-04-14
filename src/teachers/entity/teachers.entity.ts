import { BaseEntity } from "src/utils/base.entity.utils";
import { Column, Entity, JoinColumn, OneToMany } from "typeorm";
import { TeachersWorksEntity } from "./teachers.works.entity";

@Entity({name: "teachers"})
export class TeachersEntity extends BaseEntity{
  
  @Column({unique: true})
  name: string
  
  @Column()
  description: string

  @OneToMany(() => TeachersWorksEntity, works => works.category)
  works: TeachersWorksEntity[]
}