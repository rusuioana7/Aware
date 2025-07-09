// tests/threads.service.spec.ts

import { Test, TestingModule }      from '@nestjs/testing';
import { HttpService }              from '@nestjs/axios';
import { of, throwError }           from 'rxjs';
import { HttpException, HttpStatus } from '@nestjs/common';

import { ThreadsService }           from '../src/threads/threads.service';
import { ThreadDto }                from '../src/articles/dto/thread.dto';

describe('ThreadsService (unit)', () => {
    let service: ThreadsService;
    let httpService: { get: jest.Mock; delete: jest.Mock };

    beforeEach(async () => {
        // ensure env var is set
        process.env.NEWS_SERVICE_URL = 'http://test.api';

        httpService = {
            get:    jest.fn(),
            delete: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ThreadsService,
                { provide: HttpService, useValue: httpService },
            ],
        }).compile();

        service = module.get(ThreadsService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('throws if NEWS_SERVICE_URL is not defined', () => {
        delete process.env.NEWS_SERVICE_URL;
        expect(() => new ThreadsService(httpService as any)).toThrowError(
            'NEWS_SERVICE_URL must be set'
        );
        // restore for other tests
        process.env.NEWS_SERVICE_URL = 'http://test.api';
    });

    describe('findOne()', () => {
        it('should proxy GET and return thread data', async () => {
            const fake: { id: string; articles: any[] } = { id: 't1', articles: [] };
            httpService.get.mockReturnValue(of({ status: 200, data: fake }));

            const result = await service.findOne('t1');

            expect(httpService.get).toHaveBeenCalledWith(
                'http://test.api/threads/t1'
            );
            expect(result).toBe(fake);
        });

        it('should throw HttpException on error', async () => {
            httpService.get.mockReturnValue(throwError(() => new Error('fail')));

            await expect(service.findOne('t2')).rejects.toThrow(
                new HttpException('Bad gateway', HttpStatus.BAD_GATEWAY)
            );
        });
    });

    describe('findAll()', () => {
        it('should proxy GET and return array of threads', async () => {
            const list: ThreadDto[] = [
                {
                    id: 't2', articles: ['a1'],
                    title: '',
                    last_updated: ''
                },
            ];
            httpService.get.mockReturnValue(of({ status: 200, data: list }));

            const res = await service.findAll();

            expect(httpService.get).toHaveBeenCalledWith('http://test.api/threads');
            expect(res).toBe(list);
        });

        it('should throw HttpException on error', async () => {
            httpService.get.mockReturnValue(throwError(() => new Error('oops')));

            await expect(service.findAll()).rejects.toThrow(
                new HttpException('Bad gateway', HttpStatus.BAD_GATEWAY)
            );
        });
    });

    describe('delete()', () => {
        it('should proxy DELETE and not throw', async () => {
            httpService.delete.mockReturnValue(of({ status: 204 }));

            await expect(service.delete('t3')).resolves.toBeUndefined();
            expect(httpService.delete).toHaveBeenCalledWith(
                'http://test.api/threads/t3'
            );
        });

        it('should throw HttpException on error', async () => {
            httpService.delete.mockReturnValue(throwError(() => new Error('err')));

            await expect(service.delete('t4')).rejects.toThrow(
                new HttpException('Bad gateway', HttpStatus.BAD_GATEWAY)
            );
        });
    });
});
