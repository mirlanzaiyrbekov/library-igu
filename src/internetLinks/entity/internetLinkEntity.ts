import { BaseEntity } from "src/utils/base.entity.utils";
import { Column, Entity, OneToMany } from "typeorm";
import { InternetLinkCategoriesEntity } from "./internetLink.categories.entity";

@Entity({name: "internet_links"})
export class InternetLinkEntity extends BaseEntity{

  @Column({unique: true})
  name: string

  @OneToMany(() => InternetLinkCategoriesEntity, (categories) => categories.category)
  categories: InternetLinkCategoriesEntity[]
}