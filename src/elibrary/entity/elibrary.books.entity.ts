import { BaseEntity } from "src/utils/base.entity.utils";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ElibraryCategoryEntity } from "./elibrary.category.enity";

@Entity({name: "elibrary_books"})
export class ElibraryBooksEntity extends BaseEntity {
  
  @Column({default: null})
  authors?: string

  @Column({default: null})
  name: string

  @Column({type: "text", nullable: true})
  description?: string

  @Column()
  published: number

  @Column({default: 0})
  downloaded: number

  @Column({default: 0})
  views: number

  @Column()
  file: string

  @ManyToOne(() => ElibraryCategoryEntity, cat => cat.books)
  @JoinColumn({name: "category_id"})
  category: ElibraryCategoryEntity
}