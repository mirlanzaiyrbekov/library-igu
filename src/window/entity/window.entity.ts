import { BaseEntity } from "src/utils/base.entity.utils";
import { Column, Entity, OneToMany } from "typeorm";
import { WindowCategoryEntity } from "./window.category.entity";

@Entity({name: "window"})
export class WindowEntity extends BaseEntity {

  @Column({unique: true})
  name: string

  @OneToMany(() => WindowCategoryEntity, category => category.category)
  category: WindowCategoryEntity[]
}