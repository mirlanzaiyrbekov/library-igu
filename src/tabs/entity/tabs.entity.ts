import { PageEntity } from "src/page/entity/page.entity";
import { BaseEntity } from "src/utils/base.entity.utils";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { TabsLinkEntity } from "./tabs.islink";

@Entity({name: "tabs"})
export class TabsEntity extends BaseEntity{

  @Column()
  title: string

  @Column({nullable: true})
  description?: string
  
  @OneToMany(() => TabsLinkEntity, link => link.tabs)
  isLink: TabsLinkEntity[]

  @ManyToOne(() => PageEntity, page => page.tabs)
  @JoinColumn({name: "page_id"})
  page: PageEntity
}