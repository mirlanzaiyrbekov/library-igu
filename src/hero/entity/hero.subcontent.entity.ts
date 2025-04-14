import { BaseEntity } from "src/utils/base.entity.utils"
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { HeroEntity } from "./hero.entity"

@Entity({ name: 'hero_subcontent' })
export class HeroSubcontentEntity extends BaseEntity {

  @Column({ nullable: true })
  title: string

  @Column({ nullable: true })
  description: string

  @ManyToOne(() => HeroEntity, hero => hero.subcontent)
  @JoinColumn({ name: "hero_id" })
  hero: HeroEntity
}