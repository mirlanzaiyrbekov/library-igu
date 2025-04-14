import { BaseEntity } from "src/utils/base.entity.utils";
import { Column, Entity } from "typeorm";

@Entity({name: "about_tablo"})
export class AboutTabloEntity extends BaseEntity{
  
  @Column()
  ceils: number

  @Column()
  description: string
}