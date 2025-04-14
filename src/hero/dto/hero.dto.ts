import { IsEmpty, IsString, Length } from "class-validator"
import { HERO_NOT_FILE_IMAGE, HERO_TITLE_LENGTH } from "../constance/hero.constance"

export class HeroDto {
	@IsString()
	@Length(10, 300, {message: HERO_TITLE_LENGTH})
	title: string
}
