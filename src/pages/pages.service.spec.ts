import { HttpService } from '@nestjs/axios';
import { PagesService } from './pages.service';
import { Test } from '@nestjs/testing';

describe('PagesService', () => {
  let service: PagesService;
  let httpService: HttpService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PagesService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<PagesService>(PagesService);
    httpService = moduleRef.get<HttpService>(HttpService);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('httpService should be defined', () => {
    expect(httpService).toBeDefined();
  });

  it('should call getPageItems once for single page item', async () => {
    const pageItems = [{ account_number: '1', name: 'John Doe' }];
    jest.spyOn<any, any>(service, 'getPageItems').mockResolvedValue(pageItems);
    const items = await service.getItems(1, 1);
    expect(items).toEqual(pageItems);
    expect(service['getPageItems']).toHaveBeenCalledTimes(1);
  });

  it('should call getPageItems twice for items across two pages', async () => {
    const pageItems1 = Array(10).fill({
      account_number: '1',
      name: 'John Doe',
    });
    const pageItems2 = Array(10).fill({
      account_number: '2',
      name: 'Jane Doe',
    });
    jest
      .spyOn<any, any>(service, 'getPageItems')
      .mockResolvedValueOnce(pageItems1)
      .mockResolvedValueOnce(pageItems2);
    const items = await service.getItems(1, 20);
    expect(items).toEqual([...pageItems1, ...pageItems2]);
    expect(service['getPageItems']).toHaveBeenCalledTimes(2);
  });

  it('should handle empty items', async () => {
    jest.spyOn<any, any>(service, 'getPageItems').mockResolvedValue([]);
    const items = await service.getItems(1, 1);
    expect(items).toEqual([]);
    expect(service['getPageItems']).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when getPageItems fails', async () => {
    jest
      .spyOn<any, any>(service, 'getPageItems')
      .mockRejectedValue(new Error('Test error'));
    await expect(service.getItems(1, 1)).rejects.toThrow('Test error');
    expect(service['getPageItems']).toHaveBeenCalledTimes(1);
  });
});
