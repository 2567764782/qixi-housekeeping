import { IsOptional, IsString } from 'class-validator'

export class FetchToutiaoNewsDto {
  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @IsString()
  keyword?: string
}
