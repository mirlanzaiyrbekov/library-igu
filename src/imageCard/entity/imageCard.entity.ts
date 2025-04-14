import { BaseEntity } from "src/utils/base.entity.utils";
import { Column, Entity } from "typeorm";

@Entity({name: "image_card"})
export class ImageCardEntity extends BaseEntity{
  
  @Column()
  title: string

  @Column()
  subtitle: string

  @Column({type: "text"})
  description: string

  @Column()
  image: string
}