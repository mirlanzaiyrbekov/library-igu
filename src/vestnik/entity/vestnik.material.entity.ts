import { BaseEntity } from "src/utils/base.entity.utils";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { VestnikEntity } from "./vestnik.entity";

@Entity({name: "vestnik_material"})
export class VestnikMaterialEntity extends BaseEntity {
  
  @Column()
  authors: string

  @Column({default: null})
  name: string

  @Column({type: "text", nullable: true})
  description?: string

  @Column()
  file: string

  @Column({default: 0})
  downloaded?: number

  @Column({default: 0})
  views?: number

  @ManyToOne(() => VestnikEntity, category => category.materials)
  @JoinColumn({name: "category_id"})
  category: VestnikEntity
}