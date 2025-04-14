import { IsEmpty, Length } from "class-validator";

export class ArrivalDto {
  
  @IsEmpty({message: "Выберите файл"})
  image: string
}