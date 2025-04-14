import { BaseEntity } from "src/utils/base.entity.utils";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { ElibraryBooksEntity } from "./elibrary.books.entity";
import { ElibraryEntity } from "./elibrary.entity";

@Entity({name: "elibrary_category"})
export class ElibraryCategoryEntity extends BaseEntity {
  
  @Column({ name: "category", unique: true })
  name: string

  @ManyToOne(() => ElibraryEntity, cat => cat.secondCategory)
  @JoinColumn({name: "main_category_id"})
  category: ElibraryEntity

  @OneToMany(() => ElibraryBooksEntity, book => book.category)
  books: ElibraryBooksEntity[]
}