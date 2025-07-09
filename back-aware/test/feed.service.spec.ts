// tests/feed.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { HttpService }         from '@nestjs/axios';
import { of, throwError }      from 'rxjs';
import { HttpException, HttpStatus } from '@nestjs/common';

import { FeedService }          from '../src/feed/feed.service';

describe('FeedService (unit)', () => {
    let service: FeedService;
    let httpService: any;

    beforeEach(async () => {
        // ensure NEWS_SERVICE_URL is set
        process.env.NEWS_SERVICE_URL = 'http://test.api';

        // stub only the get() method on HttpService
        httpService = { get: jest.fn() };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FeedService,
                { provide: HttpService, useValue: httpService },
            ],
        }).compile();

        service = module.get(FeedService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('throws if NEWS_SERVICE_URL is not defined', () => {
        // temporarily remove the env var
        delete process.env.NEWS_SERVICE_URL;
        expect(() => new FeedService(httpService)).toThrowError(
            'NEWS_SERVICE_URL must be defined'
        );
        // restore
        process.env.NEWS_SERVICE_URL = 'http://test.api';
    });

    it('constructs and logs the base URL without trailing slash', () => {
        process.env.NEWS_SERVICE_URL = 'http://api/';  // with trailing slash
        const svc = new FeedService(httpService);
        // @ts-ignore: accessing private for test
        expect(svc['newsBase']).toBe('http://api');
    });

    it('proxies a successful GET and returns data', async () => {
        const fakeData = { articles: [1,2,3] };
        httpService.get.mockReturnValue(of({ data: fakeData }));

        const result = await service.getFeed('both', 'tech,science', 'en,fr', 2, 5, 'views');

        // build expected URL and params
        const params = new URLSearchParams({
            feed_type: 'both',
            page: '2',
            size: '5',
            sort: 'views',
        });
        params.append('topics', 'tech,science');
        params.append('languages', 'en,fr');

        expect(httpService.get).toHaveBeenCalledWith(
            `http://test.api/feed?${params.toString()}`
        );
        expect(result).toBe(fakeData);
    });

    it('omits optional params when not provided', async () => {
        const fake = { threads: [] };
        httpService.get.mockReturnValue(of({ data: fake }));

        await service.getFeed('threads');

        const params = new URLSearchParams({
            feed_type: 'threads',
            page: '1',
            size: '10',
            sort: 'published',
        });

        expect(httpService.get).toHaveBeenCalledWith(
            `http://test.api/feed?${params.toString()}`
        );
    });

    it('throws HttpException on upstream error', async () => {
        httpService.get.mockReturnValue(throwError(() => new Error('down')));

        await expect(service.getFeed('articles')).rejects.toThrow(
            new HttpException(
                'Bad gateway: could not fetch feed',
                HttpStatus.BAD_GATEWAY
            )
        );
    });
});
