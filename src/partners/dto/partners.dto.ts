import { IsEmpty, IsString, Length } from "class-validator"

export class PartnersDto {

  @IsEmpty({message: "Выберите файл"})
  image: string

  @IsString({message: "Ссылка должна быть в строковом формате"})
  @Length(3, 150, {message: "Длина ссылки должна быть не меншье 3 и не больше 150 символов"})
  link: string
}