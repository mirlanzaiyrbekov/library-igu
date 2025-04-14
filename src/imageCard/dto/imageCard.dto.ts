import { IsString, Length } from "class-validator"

export class ImageCardDto {

  @IsString()
  @Length(4, 255)
  title: string

  @IsString()
  @Length(4, 255)
  subtitle: string

  @IsString()
  @Length(4, 64500)
  description: string
}