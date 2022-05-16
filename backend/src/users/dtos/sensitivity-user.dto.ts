import { IsNumber, Max, Min } from 'class-validator';

export class SensitivityUserDto {
  @IsNumber()
  @Min(0)
  @Max(4)
  sensitivity: number;
}
