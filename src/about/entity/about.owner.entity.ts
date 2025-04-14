import { BaseEntity } from "src/utils/base.entity.utils";
import { Column, Entity } from "typeorm";

@Entity({name: "about_owner"})
export class AboutOwnerEntity extends BaseEntity{
  
  @Column({unique: true})
  name: string

  @Column()
  image: string

  @Column()
  phone: string

  @Column()
  email: string
}