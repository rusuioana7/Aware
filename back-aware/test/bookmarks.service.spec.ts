// tests/bookmarks.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { HttpService }         from '@nestjs/axios';
import { of, throwError }      from 'rxjs';
import { NotFoundException }   from '@nestjs/common';

import { BookmarksService }    from '../src/bookmarks/bookmarks.service';
import { PrismaService }       from '../src/prisma/prisma.service';
import { CreateFolderDto }     from '../src/bookmarks/dto/create-folder';
import { ArticleDto }          from '../src/articles/dto/article.dto';
import { ThreadDto }           from '../src/articles/dto/thread.dto';

describe('BookmarksService (unit)', () => {
    let service: BookmarksService;
    let prisma: any;                     // ← use `any` here
    let httpService: { axiosRef: { get: jest.Mock } };

    beforeEach(async () => {
        // Now TS won’t complain—only stub the methods you actually use:
        prisma = {
            bookmarkFolder: {
                create:    jest.fn(),
                findFirst: jest.fn(),
                update:    jest.fn(),
                delete:    jest.fn(),
                findMany:  jest.fn(),
            },
        };

        httpService = {
            axiosRef: { get: jest.fn() },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookmarksService,
                // cast prisma to PrismaService so Nest’s DI is happy at runtime
                { provide: PrismaService, useValue: prisma as PrismaService },
                { provide: HttpService,   useValue: httpService },
            ],
        }).compile();

        service = module.get(BookmarksService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('createFolder()', () => {
        it('creates a folder without parentId', async () => {
            const userId = 1;
            const dto: CreateFolderDto = { name: 'MyFolder', color: '#ff0', starred: false };
            const fake = { id: 'f1', ...dto, articleIds: [], threadIds: [], parentId: null, createdAt: new Date(), updatedAt: new Date() };
            prisma.bookmarkFolder.create.mockResolvedValue(fake);

            const res = await service.createFolder(userId, dto);

            expect(prisma.bookmarkFolder.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    name: 'MyFolder',
                    color: '#ff0',
                    starred: false,
                    articleIds: [],
                    threadIds: [],
                    user: { connect: { id: userId } },
                }),
            });
            expect(res).toBe(fake);
        });

        it('creates a folder with parentId', async () => {
            const userId = 2;
            const dto: CreateFolderDto = { name: 'SubFolder', color: '#0f0', starred: true, parentId: 'p1' };
            const fake = { id: 'f2', ...dto, articleIds: [], threadIds: [], createdAt: new Date(), updatedAt: new Date() };
            prisma.bookmarkFolder.create.mockResolvedValue(fake);

            const res = await service.createFolder(userId, dto);

            expect(prisma.bookmarkFolder.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    name: 'SubFolder',
                    color: '#0f0',
                    starred: true,
                    parent: { connect: { id: 'p1' } },
                    articleIds: [],
                    threadIds: [],
                    user: { connect: { id: userId } },
                }),
            });
            expect(res).toBe(fake);
        });
    });

    describe('addArticleToFolder()', () => {
        it('throws if folder not found', async () => {
            prisma.bookmarkFolder.findFirst.mockResolvedValue(null);
            await expect(service.addArticleToFolder(1, 'f1', 'a1')).rejects.toThrow(NotFoundException);
        });

        it('adds an articleId when folder exists', async () => {
            const folder = { id: 'f1', userId: 1, articleIds: ['a1'], threadIds: [] };
            prisma.bookmarkFolder.findFirst.mockResolvedValue(folder);
            prisma.bookmarkFolder.update.mockResolvedValue(folder);

            const res = await service.addArticleToFolder(1, 'f1', 'a2');
            expect(prisma.bookmarkFolder.update).toHaveBeenCalledWith({
                where: { id: 'f1' },
                data: { articleIds: { set: ['a1', 'a2'] } },
            });
            expect(res).toBe(folder);
        });
    });

    describe('addThreadToFolder()', () => {
        it('throws if folder not found', async () => {
            prisma.bookmarkFolder.findFirst.mockResolvedValue(null);
            await expect(service.addThreadToFolder(2, 'f2', 't1')).rejects.toThrow(NotFoundException);
        });

        it('adds a threadId when folder exists', async () => {
            const folder = { id: 'f2', userId: 2, articleIds: [], threadIds: ['t1'] };
            prisma.bookmarkFolder.findFirst.mockResolvedValue(folder);
            prisma.bookmarkFolder.update.mockResolvedValue(folder);

            const res = await service.addThreadToFolder(2, 'f2', 't2');
            expect(prisma.bookmarkFolder.update).toHaveBeenCalledWith({
                where: { id: 'f2' },
                data: { threadIds: { set: ['t1', 't2'] } },
            });
            expect(res).toBe(folder);
        });
    });

    describe('getThreadsFromFolder()', () => {
        it('fetches threads and filters out failures', async () => {
            const folder = { threadIds: ['t1', 't2'] };
            const t1: { id: string; articles: any[] } = { id: 't1', articles: [] };
            httpService.axiosRef.get
                .mockResolvedValueOnce({ data: t1 })
                .mockRejectedValueOnce(new Error('404'));

            const res = await service.getThreadsFromFolder(folder);
            expect(res).toEqual([t1]);
        });
    });

    describe('removeFolder()', () => {
        it('throws if folder not found', async () => {
            prisma.bookmarkFolder.findFirst.mockResolvedValue(null);
            await expect(service.removeFolder(3, 'f3')).rejects.toThrow(NotFoundException);
        });

        it('deletes when folder exists', async () => {
            const fake = {};
            prisma.bookmarkFolder.findFirst.mockResolvedValue(fake);
            prisma.bookmarkFolder.delete.mockResolvedValue(fake);

            const res = await service.removeFolder(3, 'f3');
            expect(prisma.bookmarkFolder.delete).toHaveBeenCalledWith({ where: { id: 'f3' } });
            expect(res).toBe(fake);
        });
    });

    describe('toggleStar()', () => {
        it('throws if folder not found', async () => {
            prisma.bookmarkFolder.findFirst.mockResolvedValue(null);
            await expect(service.toggleStar(4, 'f4')).rejects.toThrow(NotFoundException);
        });

        it('toggles starred flag', async () => {
            const folder = { id: 'f4', starred: false };
            const updated = { id: 'f4', starred: true };
            prisma.bookmarkFolder.findFirst.mockResolvedValue(folder);
            prisma.bookmarkFolder.update.mockResolvedValue(updated);

            const res = await service.toggleStar(4, 'f4');
            expect(prisma.bookmarkFolder.update).toHaveBeenCalledWith({
                where: { id: 'f4' },
                data: { starred: true },
            });
            expect(res).toBe(updated);
        });
    });

    describe('getFolderById()', () => {
        it('throws if folder not found', async () => {
            prisma.bookmarkFolder.findFirst.mockResolvedValue(null);
            await expect(service.getFolderById(5, 'f5')).rejects.toThrow(NotFoundException);
        });

        it('returns folder when found', async () => {
            const fake = { id: 'f5' };
            prisma.bookmarkFolder.findFirst.mockResolvedValue(fake);
            const res = await service.getFolderById(5, 'f5');
            expect(res).toBe(fake);
        });
    });

    describe('getArticlesFromFolder()', () => {
        it('fetches articles and filters nulls', async () => {
            const folder = { articleIds: ['a1', 'a2'] };
            const a1: ArticleDto = {
                credibility_label: "",
                language: "",
                url: "",
                id: 'a1', title: '', author: '', source: '', published: '', content: '', topics: [''] };
            httpService.axiosRef.get
                .mockResolvedValueOnce({ data: a1 })
                .mockRejectedValueOnce(new Error());

            const res = await service.getArticlesFromFolder(folder);
            expect(res).toEqual([a1]);
        });
    });

    describe('getAllArticlesInFolder()', () => {
        it('merges articleIds and thread articleIds', async () => {
            jest.spyOn(service, 'getThreadsFromFolder').mockResolvedValue([{ id: 't1', articles: ['a3'] }] as ThreadDto[]);
            const folder = { articleIds: ['a1', 'a2'], threadIds: ['t1'] };
            const make = (id: string) => ({ data: { id, title: '', author: '', source: '', published: '', content: '', topic: '' } });
            httpService.axiosRef.get
                .mockResolvedValueOnce(make('a1'))
                .mockResolvedValueOnce(make('a2'))
                .mockResolvedValueOnce(make('a3'));

            const res = await service.getAllArticlesInFolder(folder);
            expect(res.map(x => x.id).sort()).toEqual(['a1','a2','a3']);
        });
    });

    describe('getFolderTree()', () => {
        it('builds a nested tree from a flat list', async () => {
            const now = new Date();
            const flat = [
                { id:'r1', parentId:null, name:'Root', color:null, starred:false, articleIds:[], threadIds:[], createdAt:now, updatedAt:now },
                { id:'c1', parentId:'r1', name:'Child', color:null, starred:false, articleIds:[], threadIds:[], createdAt:now, updatedAt:now },
            ];
            prisma.bookmarkFolder.findMany.mockResolvedValue(flat);

            const tree = await service.getFolderTree(6);
            expect(tree.length).toBe(1);
            expect(tree[0].children[0].id).toBe('c1');
        });
    });

    describe('getSaveForLaterFolder()', () => {
        it('fetches the Save for Later folder', async () => {
            const fake = { id:'sf1', name:'Save for Later' };
            prisma.bookmarkFolder.findFirst.mockResolvedValue(fake);

            const res = await service.getSaveForLaterFolder(7);
            expect(prisma.bookmarkFolder.findFirst).toHaveBeenCalledWith({
                where: { userId:7, name:{ equals:'Save for Later', mode:'insensitive' } },
            });
            expect(res).toBe(fake);
        });
    });

    describe('removeArticleFromFolder()', () => {
        it('throws if folder not found', async () => {
            prisma.bookmarkFolder.findFirst.mockResolvedValue(null);
            await expect(service.removeArticleFromFolder(8,'f8','a1')).rejects.toThrow(NotFoundException);
        });

        it('removes an articleId when folder exists', async () => {
            const folder = { id:'f8', articleIds:['a1','a2'], threadIds:[] };
            prisma.bookmarkFolder.findFirst.mockResolvedValue(folder);
            prisma.bookmarkFolder.update.mockResolvedValue(folder);

            await service.removeArticleFromFolder(8,'f8','a1');
            expect(prisma.bookmarkFolder.update).toHaveBeenCalledWith({
                where: { id:'f8' },
                data: { articleIds:{ set:['a2'] } },
            });
        });
    });
});
