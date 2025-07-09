// tests/articles.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { HttpService }         from '@nestjs/axios';
import { of, throwError }      from 'rxjs';
import { AxiosResponse }       from 'axios';
import { Buffer }              from 'buffer';
import PDFDocument             from 'pdfkit';
import * as textToSpeech       from '@google-cloud/text-to-speech';
import { Logger, HttpException, HttpStatus } from '@nestjs/common';

import { ArticlesService }     from '../src/articles/articles.service';
import { CommentsService }     from '../src/comments/comments.service';
import { ArticleDto }          from '../src/articles/dto/article.dto';
import { ThreadDto }           from '../src/articles/dto/thread.dto';

// --- pdfkit mock ---
jest.mock('pdfkit', () => {
    return jest.fn().mockImplementation(() => {
        const handlers: Record<string, Function[]> = {};
        return {
            page: { width: 500, margins: { left: 10, right: 10 } },
            y: 0,
            on(evt: string, cb: Function) {
                (handlers[evt] ||= []).push(cb);
            },
            fontSize()   { return this; },
            text()       { return this; },
            moveDown()   { return this; },
            image()      { return this; },
            end() {
                handlers['data']?.forEach(cb => cb(Buffer.from('chunk')));
                handlers['end']?.forEach(cb => cb());
            },
        };
    });
});

// --- text-to-speech mock ---
jest.mock('@google-cloud/text-to-speech', () => ({
    TextToSpeechClient: jest.fn().mockImplementation(() => ({
        synthesizeSpeech: jest.fn().mockResolvedValue([{ audioContent: Uint8Array.from([1, 2, 3]) }]),
    })),
    protos: {
        google: {
            cloud: {
                texttospeech: {
                    v1: {
                        SsmlVoiceGender: { NEUTRAL: 'NEUTRAL' },
                        AudioEncoding:   { MP3: 'MP3' },
                    }
                }
            }
        }
    }
}));

describe('ArticlesService', () => {
    let service: ArticlesService;
    let httpService: any;
    let commentsService: any;
    let logSpy: jest.SpyInstance;
    let errorSpy: jest.SpyInstance;
    let warnSpy: jest.SpyInstance;

    const BASE = 'http://test.api';

    beforeEach(async () => {
        process.env.NEWS_SERVICE_URL = `${BASE}/`;  // include trailing slash for trim test

        httpService = {
            get:    jest.fn(),
            delete: jest.fn(),
            patch:  jest.fn(),
            axiosRef: { get: jest.fn() },
        };
        commentsService = { countByArticle: jest.fn() };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ArticlesService,
                { provide: HttpService,     useValue: httpService },
                { provide: CommentsService, useValue: commentsService },
            ],
        }).compile();

        service     = module.get(ArticlesService);
        logSpy      = jest.spyOn(Logger.prototype, 'log').mockImplementation();
        errorSpy    = jest.spyOn(Logger.prototype, 'error').mockImplementation();
        warnSpy     = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    });

    afterEach(() => {
        jest.resetAllMocks();
        delete process.env.NEWS_SERVICE_URL;
    });

    it('trims trailing slash from NEWS_SERVICE_URL', () => {
        // constructor already ran in beforeEach
        expect((service as any).newsBase).toBe(BASE);
    });

    it('constructor throws if NEWS_SERVICE_URL unset', () => {
        delete process.env.NEWS_SERVICE_URL;
        expect(() => new ArticlesService(httpService, commentsService))
            .toThrow('NEWS_SERVICE_URL must be set');
    });

    describe('findOne()', () => {
        const dto: ArticleDto & { thread?: ThreadDto } = {
            id: 'ID1', title: 'Title', author: 'Auth', source: 'Src',
            published: 'Date', content: 'Body', language: 'en',
            url: '', credibility_label:'', topics: []
        };

        it('proxies GET, logs properly, and injects commentsCount', async () => {
            const resp: AxiosResponse<any> = {
                status: 200, data: dto, headers: {}, config: {} as any, statusText: ''
            };
            httpService.get.mockReturnValueOnce(of(resp));
            commentsService.countByArticle.mockResolvedValue(7);

            const result = await service.findOne('ID1');

            expect(logSpy).toHaveBeenCalledWith(`→ proxying GET ${BASE}/articles/ID1`);
            expect(httpService.get).toHaveBeenCalledWith(`${BASE}/articles/ID1`);
            expect(commentsService.countByArticle).toHaveBeenCalledWith('ID1');
            expect(logSpy).toHaveBeenCalledWith(
                `← got 200, injecting commentsCount: 7`
            );
            expect(result).toEqual({ ...dto, commentsCount: 7 });
        });

        it('logs and throws HttpException on upstream error', async () => {
            httpService.get.mockReturnValueOnce(throwError(() => new Error('boom')));
            await expect(service.findOne('ID2')).rejects.toThrow(HttpException);
            expect(errorSpy).toHaveBeenCalledWith(`✖️ upstream error: boom`);
        });
    });

    describe('findAll()', () => {
        it('proxies list GET and logs', async () => {
            const list = [{ id:'ID3' } as ArticleDto];
            httpService.get.mockReturnValueOnce(of({ status:200, data:list }));
            const res = await service.findAll();
            expect(logSpy).toHaveBeenCalledWith(`→ proxying GET ${BASE}/articles`);
            expect(httpService.get).toHaveBeenCalledWith(`${BASE}/articles`);
            expect(logSpy).toHaveBeenCalledWith(`← got 200 articles`);
            expect(res).toBe(list);
        });

        it('logs and throws on error', async () => {
            httpService.get.mockReturnValueOnce(throwError(() => new Error('fail')));
            await expect(service.findAll()).rejects.toThrow(HttpException);
            expect(errorSpy).toHaveBeenCalledWith(`✖️ upstream error: fail`);
        });
    });

    describe('delete()', () => {
        it('proxies DELETE and logs', async () => {
            httpService.delete.mockReturnValueOnce(of({ status:204 }));
            await expect(service.delete('ID4')).resolves.toBeUndefined();
            expect(logSpy).toHaveBeenCalledWith(`→ proxying DELETE ${BASE}/articles/ID4`);
            expect(httpService.delete).toHaveBeenCalledWith(`${BASE}/articles/ID4`);
            expect(logSpy).toHaveBeenCalledWith(`← got 204 for DELETE article ID4`);
        });

        it('logs and throws on error', async () => {
            httpService.delete.mockReturnValueOnce(throwError(() => new Error('err')));
            await expect(service.delete('ID5')).rejects.toThrow(HttpException);
            expect(errorSpy).toHaveBeenCalledWith(`✖️ error deleting article ID5: err`);
        });
    });

    describe('generateArticleFile()', () => {
        beforeEach(() => {
            jest.spyOn(service, 'findOne').mockResolvedValue({
                title:'T', author:'A', source:'S', published:'P', content:'C', language:'en'
            } as any);
        });

        ['txt','md'].forEach(ext => {
            it(`returns text buffer & filename for .${ext}`, async () => {
                const out = await service.generateArticleFile('ID6', ext as any);
                expect(out.mimeType).toBe('text/plain');
                expect(out.filename).toBe(`T.${ext}`);
                expect(out.buffer.toString()).toContain('By A | S');
            });
        });

        it('builds PDF without image and returns chunk buffer', async () => {
            (service.findOne as jest.Mock).mockResolvedValue({
                title:'T', author:'A', source:'S', published:'P', content:'C', image: null, language:'en'
            } as any);
            const { mimeType, filename, buffer } = await service.generateArticleFile('ID7','pdf');
            expect(mimeType).toBe('application/pdf');
            expect(filename).toBe('T.pdf');
            expect(buffer).toEqual(Buffer.from('chunk'));
        });

        it('embeds image when present', async () => {
            (service.findOne as jest.Mock).mockResolvedValue({
                title:'T', author:'A', source:'S', published:'P', content:'C', image:'IMG', language:'en'
            } as any);
            httpService.axiosRef.get.mockResolvedValue({ data: Uint8Array.from([9]).buffer });
            const out = await service.generateArticleFile('ID8','pdf');
            expect(httpService.axiosRef.get).toHaveBeenCalledWith('IMG', { responseType:'arraybuffer' });
            expect(out.mimeType).toBe('application/pdf');
        });

        it('warns and continues on image fetch failure', async () => {
            (service.findOne as jest.Mock).mockResolvedValue({
                title:'T', author:'A', source:'S', published:'P', content:'C', image:'BAD', language:'en'
            } as any);
            httpService.axiosRef.get.mockRejectedValue(new Error('nope'));
            const out = await service.generateArticleFile('ID9','pdf');
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Could not fetch or embed image'));
            expect(out.mimeType).toBe('application/pdf');
        });
    });

    describe('generateAudio()', () => {
        it('requests correct language voice and returns buffer', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue({
                title:'T', author:'A', content:'C', language:'fr'
            } as any);
            const buf = await service.generateAudio('ID10');
            expect(textToSpeech.TextToSpeechClient).toHaveBeenCalled();
            expect(buf).toEqual(Buffer.from([1,2,3]));
        });

        it('falls back to en-US on unknown language', async () => {
            jest.spyOn(service, 'findOne').mockResolvedValue({
                title:'T', author:'A', content:'C', language:'zz'
            } as any);
            let lastReq: any;
            (textToSpeech.TextToSpeechClient as unknown as jest.Mock).mockImplementationOnce(() => ({
                synthesizeSpeech: jest.fn().mockImplementation(req => {
                    lastReq = req; return Promise.resolve([{ audioContent: Uint8Array.from([5]) }]);
                }),
            }));
            const buf = await service.generateAudio('ID11');
            expect(lastReq.voice.languageCode).toBe('en-US');
            expect(buf).toEqual(Buffer.from([5]));
        });

        it('throws if response missing audioContent', async () => {
            (textToSpeech.TextToSpeechClient as unknown as jest.Mock).mockImplementationOnce(() => ({
                synthesizeSpeech: jest.fn().mockResolvedValue([{}]),
            }));
            jest.spyOn(service, 'findOne').mockResolvedValue({
                title:'T', author:'A', content:'C', language:'en'
            } as any);
            await expect(service.generateAudio('ID12')).rejects.toThrow('Failed to generate audio');
        });
    });

    describe('report()', () => {
        it('logs and patches successfully', async () => {
            httpService.patch.mockReturnValueOnce(of({ status:200 }));
            await service.report('ID13');
            expect(logSpy).toHaveBeenCalledWith(`→ PATCH ${BASE}/articles/ID13/report`);
            expect(httpService.patch).toHaveBeenCalledWith(`${BASE}/articles/ID13/report`, {});
        });

        it('logs error and swallows on patch failure', async () => {
            httpService.patch.mockReturnValueOnce(throwError(() => new Error('boom')));
            await service.report('ID14');
            expect(errorSpy).toHaveBeenCalledWith(`Failed to report article ID14: boom`);
        });
    });
});
