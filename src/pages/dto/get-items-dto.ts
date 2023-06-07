import { IsInt, IsIn, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetItemsDto {
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  readonly page: number;

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsIn([5, 10, 15, 20])
  readonly size: number;
}
