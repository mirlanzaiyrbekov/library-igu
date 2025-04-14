import { BaseEntity } from "src/utils/base.entity.utils";
import { Column, Entity } from "typeorm";


@Entity({name: "partners"})
export class PartnersEntity extends BaseEntity {

  @Column()
  image: string

  @Column()
  link: string
}