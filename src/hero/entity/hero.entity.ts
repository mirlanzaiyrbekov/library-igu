import { PageEntity } from "src/page/entity/page.entity"
import { BaseEntity } from "src/utils/base.entity.utils"
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm"
import { HERO_DEFAULT_IMAGE } from '../constance/hero.constance'
import { HeroSubcontentEntity } from "./hero.subcontent.entity"

@Entity({ name: "hero" })
export class HeroEntity extends BaseEntity {

  @Column()
  title: string

  @Column({ name: "hero_image", default: HERO_DEFAULT_IMAGE })
  background?: string

  @OneToMany(() => HeroSubcontentEntity, subcontent => subcontent.hero)
  subcontent: HeroSubcontentEntity[]
  
  @ManyToOne(() => PageEntity, page => page.hero)
  @JoinColumn({ name: "page_id" })
  page: PageEntity
}