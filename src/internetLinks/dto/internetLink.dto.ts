import { IsString, Length } from "class-validator"

export class InternetLinkDto {

  @IsString()
  @Length(4, 255)
  name: string
}

export class InternetLinkCategoriesDto {

  @IsString()
  @Length(4, 255)
  name: string

  description?: string
  
  @IsString()
  @Length(5, 255)
  link: string 
}