import { BaseEntity } from "src/utils/base.entity.utils";
import { Column, Entity } from "typeorm";

@Entity({name: "news"})
export class NewsEntity extends BaseEntity{
  
  @Column()
  title: string

  @Column()
  image: string

  @Column({type: "text"})
  description: string
}