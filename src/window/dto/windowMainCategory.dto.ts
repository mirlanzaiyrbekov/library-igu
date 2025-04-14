import { IsString, Length } from "class-validator";

export class MainCategoryDto {

  @IsString()
  @Length(3, 255)
  name: string
}