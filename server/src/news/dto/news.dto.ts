import { IsOptional, IsString, IsIn } from 'class-validator'

export class FetchToutiaoNewsDto {
  @IsOptional()
  @IsString()
  @IsIn(['finance', 'entertainment', 'family'])
  category?: string

  @IsOptional()
  @IsString()
  keyword?: string
}
