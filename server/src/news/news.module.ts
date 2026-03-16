import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { NewsController } from './news.controller'
import { NewsService } from './news.service'
import { NewsCronService } from './news-cron.service'
import { NewsRepository } from './news.repository'

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [NewsController],
  providers: [NewsService, NewsCronService, NewsRepository],
  exports: [NewsService, NewsCronService, NewsRepository]
})
export class NewsModule {}
