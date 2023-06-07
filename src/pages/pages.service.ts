import * as NodeCache from 'node-cache';
import { Account, MoodyApiResponse } from './types/pages.interface';
import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { timeout } from 'rxjs';

@Injectable()
export class PagesService {
  private maxRetryCount = Number(process.env.MOODY_API_RETRY_COUNT) || 10;
  private moodyApiBaseUrl = process.env.MOODY_API_BASE_URI;
  private requestTimout = Number(process.env.MOODY_API_REQUEST_TIMEOUT) || 1000;

  private cache = new NodeCache({
    stdTTL: Number(process.env.CACHE_TTL),
  });
  private logger = new Logger(PagesService.name);

  constructor(private http: HttpService) {}

  /**
   * This function retrieves items based on the page number and size.
   * It ensures that there are no null or empty items in the response and also maintains order.
   * @param {number} [page] - The paginated page number.
   * @param {number} [size] - The number of items per page.
   * @returns {Promise<Account[]>} - Returns a promise with an array of account items.
   */
  public async getItems(page: number, size: number): Promise<Account[]> {
    const start = (page - 1) * size + 1;
    const end = page * size;

    // Calculate the start and end page numbers, and the index within the pages
    const startPage = Math.ceil(start / 10);
    const startIndexInPage = (start - 1) % 10;

    const endPage = Math.ceil(end / 10);
    const endIndexInPage = (end - 1) % 10;

    // Collect all requested items across the relevant pages
    const items: Account[] = [];
    for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
      const startIndex = pageNumber === startPage ? startIndexInPage : 0;
      const endIndex = pageNumber === endPage ? endIndexInPage : 9;

      // Construct the array of indices needed from this page
      const indices = Array.from(
        { length: endIndex - startIndex + 1 },
        (_, i) => startIndex + i,
      );

      // Fetch all items from this page
      const pageItems = await this.getPageItems(
        pageNumber,
        indices,
        this.maxRetryCount,
      );

      // Append items to the final list
      items.push(...pageItems);
    }

    return items;
  }

  /**
   * This function retrieves items from a specific page.
   * It ensures that the Moody API is called until non-null and non-empty items are retrieved for the requested indices.
   * @param {number} [pageNumber] - The paginated page number.
   * @param {number[]} [indices] - The list of indices to be filled.
   * @param {number} [retries] - The max request retry count if Moody API is unresponsive.
   * @returns {Promise<Account[]>} - Returns a promise with an array of account items.
   */
  private async getPageItems(
    pageNumber: number,
    indices: number[],
    retries: number,
  ): Promise<Account[]> {
    // First try to get all items from the cache
    const cachedItems: Account[] = [];
    let isMissingInCache = false;

    for (const index of indices) {
      const cachedItem: Account = this.cache.get(`${pageNumber}_${index}`);
      if (cachedItem) {
        cachedItems.push(cachedItem);
      } else {
        isMissingInCache = true;
        break;
      }
    }

    // If all items were in the cache, return them
    if (!isMissingInCache) return cachedItems;

    try {
      this.logger.log(`Fetching items from page ${pageNumber}`);
      const response = await this.http
        .get<MoodyApiResponse>(`${this.moodyApiBaseUrl}/page/${pageNumber}`)
        .pipe(timeout(this.requestTimout))
        .toPromise();

      if (Array.isArray(response.data.message)) {
        const items = [];
        for (const index of indices) {
          const item = response.data.message[index];

          // If the item is null or empty, fetch the entire page again
          while (!item || Object.keys(item).length === 0) {
            this.logger.log(
              `Empty item found at index ${index} in page ${pageNumber}, fetching page again`,
            );
            return this.getPageItems(pageNumber, indices, retries); // Return new page fetch result
          }

          // Cache the non-empty item
          this.cache.set(`${pageNumber}_${index}`, item);

          // Add non-empty item to the list
          items.push(item);
        }

        return items;
      } else {
        throw new Error('Invalid response data from Moody API');
      }
    } catch (error) {
      this.logger.error(
        `Failed to fetch page ${pageNumber} from Moody API: ${error.message}`,
      );

      // Retry fetching the page if it failed and there are retries left
      if (retries > 0) {
        this.logger.log(
          `Retrying to fetch page ${pageNumber} from Moody API (${retries} retries left)`,
        );
        return this.getPageItems(pageNumber, indices, retries - 1);
      } else {
        // If no retries left, throw the error
        throw new InternalServerErrorException(
          'Failed to fetch data from Moody API',
        );
      }
    }
  }
}
