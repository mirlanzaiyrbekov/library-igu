import { PageEntity } from "src/page/entity/page.entity";
import { BaseEntity } from "src/utils/base.entity.utils";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { JournalHeadEntity } from "./journal.head.entity";

@Entity({name: "journal"})
export class JournalEntity extends BaseEntity{

  @Column({name: "journal_title"})
  title: string

  @Column({name: "journal_subtitle"})
  subtitle: string

  @Column({name: "journal_description", type: "text"})
  description: string

  @Column({name: "journal_image", default: null})
  image?: string

  @OneToMany(() => JournalHeadEntity, jhead => jhead.journal)
  journalHead: JournalHeadEntity[]

  @ManyToOne(() => PageEntity, page => page.journal)
  @JoinColumn({name: "page_id"})
  page: PageEntity
}