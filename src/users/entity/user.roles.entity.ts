import { BaseEntity } from "src/utils/base.entity.utils"
import { Column, Entity, ManyToOne } from "typeorm"
import { UserEntity } from "./user.entity"

@Entity({ name: "users_roles" })
export class UserRoleEntity extends BaseEntity {

  @Column({default: "Moderator"})
  name: string

  @ManyToOne(() => UserEntity, user => user.role)
  user: UserEntity
}