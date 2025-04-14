import { IsString, Length } from "class-validator";
import { PAGE_MIN_NAME,  PAGE_NOT_A_STRING } from "../constance/page.message.constance";

export class PageDto {
  @IsString({ message: PAGE_NOT_A_STRING })
  @Length(4, 50, {message: PAGE_MIN_NAME})
  name: string
}