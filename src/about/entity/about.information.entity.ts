import { BaseEntity } from "src/utils/base.entity.utils";
import { Column, Entity } from "typeorm";

@Entity({name: "about_iformation"})
export class AboutInformationEntity extends BaseEntity{
  
  @Column({nullable: true})
  title?: string

  @Column({type: "text", nullable: true})
  description?: string

  @Column({nullable: true})
  image?: string
}