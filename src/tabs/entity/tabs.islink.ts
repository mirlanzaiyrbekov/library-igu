import { BaseEntity } from "src/utils/base.entity.utils";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { TabsEntity } from "./tabs.entity";

@Entity({name: "tabs_link"})
export class TabsLinkEntity extends BaseEntity{

  @Column({name: "link_name"})
  name: string

  @Column()
  link?: string

  @ManyToOne(() => TabsEntity, tabs => tabs.isLink)
  @JoinColumn({name: "tabs_id"})
  tabs: TabsEntity
  
}