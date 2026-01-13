import { Module } from '@nestjs/common';
import { BlogpostService } from './blogpost.service';
import { BlogpostController } from './blogpost.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogpostEntity } from 'src/modules/database/entities/blogpost.entity';
import { SearchService } from './search.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlogpostEntity])],
  controllers: [BlogpostController],
  providers: [BlogpostService, SearchService, BlogpostEntity],
  exports: [BlogpostEntity],
})
export class BlogpostModule {}
