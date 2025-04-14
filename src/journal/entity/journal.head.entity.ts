import { BaseEntity } from "src/utils/base.entity.utils";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { JournalEntity } from "./journal.entity";
import { JournalHeadItemsEntity } from "./journal.headItems.entity";

@Entity({name: "journal_head"})
export class JournalHeadEntity extends BaseEntity {

  @Column({name: "journal_head_title"})
  title: string

  @OneToMany(() => JournalHeadItemsEntity, items => items.journal_head)
  items: JournalHeadItemsEntity[]

  @ManyToOne(() => JournalEntity, journal => journal.journalHead)
  @JoinColumn({name: "journal_id"})
  journal: JournalEntity
}