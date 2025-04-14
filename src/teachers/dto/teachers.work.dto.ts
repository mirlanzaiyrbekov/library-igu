import { IsString, Length } from "class-validator"

export class TeachersWorkDto {

  @IsString({message: "Авторы должны быть в строковм формате"})
  @Length(3, 255, {message: "Минимальная длина авторов 3 символа. И не должен быть больше 255"})
  authors: string

  @IsString({message: "Название должно быть в строковм формате"})
  @Length(5, 255, {message: "Минимальная длина названия 5 символов. И не должен быть больше 255"})
  name: string

  description?: string
}