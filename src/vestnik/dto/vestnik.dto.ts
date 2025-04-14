import { IsString, Length } from "class-validator";

export class IVestnikDto {

  @IsString()
  @Length(3, 100)
  name: string
}