import { IsNumber, Max, Min } from 'class-validator';

export class SensitivityUserDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  sensitivity: number;
}
