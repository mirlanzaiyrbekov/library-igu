import { BaseEntity } from "src/utils/base.entity.utils";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { JournalHeadEntity } from "./journal.head.entity";

@Entity({name: "journal_head_items"})
export class JournalHeadItemsEntity extends BaseEntity {

  @Column({name: "journal_head_items_title"})
  title: string

  @Column({name: "journal_head_items_description"})
  description: string

  @ManyToOne(() => JournalHeadEntity, jhead => jhead.items)
  @JoinColumn({name: "journal_head_id"})
  journal_head: JournalHeadEntity
}