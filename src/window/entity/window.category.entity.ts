import { BaseEntity } from "src/utils/base.entity.utils";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { WindowEntity } from "./window.entity";

@Entity({name: "window_category"})
export class WindowCategoryEntity extends BaseEntity {

  @Column()
  name: string

  @Column()
  file: string

  @ManyToOne(() => WindowEntity)
  @JoinColumn({name: "category_id"})
  category: WindowEntity
}