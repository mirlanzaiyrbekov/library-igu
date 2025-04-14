import { IsNumber, IsString, Length } from "class-validator";

export class ElibraryDto {
  
  @IsString({message: "Название категории должно быть в строковом формате"})
  @Length(4, 255, {message: "Минимальная длина названии 4 символа. Макс. 255 "})
  name: string
}

export class ElibraryCategoryDto {
  
  @IsString({message: "Название подкатегории должно быть в строковом формате"})
  @Length(4, 255, {message: "Минимальная длина подкатегории 4 символа. Макс. 255 "})
  name: string
}

export class ElibraryBookDto {

  authors?: string

  @IsString({message: "Название должно быть в строковом формате"})
  @Length(4, 255, {message: "Минимальная длина названия 4 символа. Макс. 255 "})
  name: string

  description?: string

  published: number
}