import { PageEntity } from "src/page/entity/page.entity";
import { BaseEntity } from "src/utils/base.entity.utils";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { VestnikMaterialEntity } from "./vestnik.material.entity";

@Entity({name: "vestnik"})
export class VestnikEntity extends BaseEntity {


  @Column({unique: true})
  name: string

  @OneToMany(() => VestnikMaterialEntity, material => material.category)
  materials: VestnikMaterialEntity[]

  @ManyToOne(() => PageEntity, page => page)
  page: PageEntity
}