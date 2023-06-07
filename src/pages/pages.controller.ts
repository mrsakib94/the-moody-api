import { Account } from './types/pages.interface';
import { Controller, Get, Logger, Param, ValidationPipe } from '@nestjs/common';
import { GetItemsDto } from './dto/get-items-dto';
import { PagesService } from './pages.service';

@Controller('moodyapi')
export class PagesController {
  private readonly logger = new Logger(PagesController.name);

  constructor(private pagesService: PagesService) {}

  @Get('pageSize/:size/page/:page')
  getItems(
    @Param(new ValidationPipe({ transform: true })) params: GetItemsDto,
  ): Promise<Account[]> {
    this.logger.log(`Requested ${params.size} items from page ${params.page}`);
    return this.pagesService.getItems(params.page, params.size);
  }
}
