import { IsString, Length } from "class-validator"

export class JournalHeadItemsDto {
  @IsString()
  @Length(8, 255)
	title: string

  @IsString()
  @Length(5, 255)
  description: string
}
