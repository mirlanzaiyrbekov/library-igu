import { IsEmpty, IsString, Length } from "class-validator"

export class NewsDto {

  @IsString({message: "Название новости должно быть в строковм формате"})
  @Length(4, 255, {message: "Название новости не может быть меньше 4 и не больше 255 символов"})
  title: string

  @IsString({message: "Описание новости должно быть в строковм формате"})
  @Length(10, 64500, {message: "Описание новости не может быть меньше 10 символов"})
  description: string
}