import { BaseEntity } from "src/utils/base.entity.utils";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { InternetLinkEntity } from "./internetLinkEntity";

@Entity({name: "internet_link_categories"})
export class InternetLinkCategoriesEntity extends BaseEntity{

  @Column()
  name: string

  @Column()
  link: string 

  @Column({nullable: true})
  description?: string 

  @Column({default: 0})
  transitions: number

  @ManyToOne(() => InternetLinkEntity, (category) => category.categories)
  @JoinColumn({name: "category_id"})
  category: InternetLinkEntity
}