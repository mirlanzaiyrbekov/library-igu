import { IsString, Length } from "class-validator"

export class JournalHeadDto {
  @IsString()
  @Length(8, 255)
	title: string
}
