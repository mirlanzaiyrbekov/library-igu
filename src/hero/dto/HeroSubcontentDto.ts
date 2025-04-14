import { IsString, Length } from "class-validator"
import { HERO_SUBCONTENT_DESCRIPTION_LENGTH, HERO_SUBCONTENT_TITLE_LENGTH } from "../constance/hero.subcontent.constace"

export class HeroSubcontentDto{

  @IsString()
  @Length(3, 150, {message: HERO_SUBCONTENT_TITLE_LENGTH})
  title: string

  @IsString()
  @Length(3, 200, {message: HERO_SUBCONTENT_DESCRIPTION_LENGTH})
  description: string
}