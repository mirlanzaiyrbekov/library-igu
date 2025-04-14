import { IsString, Length } from "class-validator"

export class JournalDto {

  @IsString()
  @Length(8, 255)
	title: string

  @IsString()
  @Length(4, 255)
	subtitle: string

  @IsString()
  @Length(50, 100000)
	description: string
}
