import { IsString, Length } from "class-validator"

export class TeachersDto {
  
  @IsString({message: "Название категории должно быть в строковом формате"})
  @Length(3, 255, {message: "Название категории не может быть меньше 3 символов. И не должен быть больше 255 символов"})
  name: string

  @IsString({message: "Описание категории должно быть в строковом формате"})
  @Length(3, 255, {message: "Описание категории не может быть меньше 3 символов. И не должен быть больше 255 символов"})
  description: string
}