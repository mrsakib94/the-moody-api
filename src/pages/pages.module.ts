import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';

@Module({
  imports: [HttpModule],
  controllers: [PagesController],
  providers: [PagesService],
})
export class PagesModule {}
