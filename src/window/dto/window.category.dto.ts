import { IsString, Length } from "class-validator";

export class WindowCategoryDto {

  @IsString()
  @Length(3, 255)
  name: string
}