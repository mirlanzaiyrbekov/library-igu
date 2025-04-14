import { IsEmail, IsNumber, IsString, Length } from "class-validator"

export class AboutOwnerDto {

  @IsString({message: "Введите имя в строковом формате."})
  @Length(4, 255, {message: "Длина имени не может быть меньше 4 символов. И не может быть больше 255"})
  name: string

  @IsString({message: "Телефон должен быть в строковом формате."})
  @Length(4, 255, {message: "Длина номера не может быть меньше 4 символов. И не может быть больше 255"})
  phone: string

  @IsString({message: "E-mail должен быть в строковом формате."})
  @IsEmail()
  @Length(4, 255, {message: "Длина E-mail не может быть меньше 4 символов. И не может быть больше 255"})
  email: string
}
export class AboutInfoDto {

  title?: string

  description?: string
}
export class AboutTabloDto {

  @IsNumber()
  ceils: number

  @IsString({message: "Описание должен быть в строковом формате."})
  description?: string
}