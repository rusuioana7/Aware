// tests/comments.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { HttpService }         from '@nestjs/axios';
import { of }                  from 'rxjs';

import { CommentsService }     from '../src/comments/comments.service';
import { PrismaService }       from '../src/prisma/prisma.service';

describe('CommentsService (unit)', () => {
    let service: CommentsService;
    let prisma: any;           // cast to any so TS won’t demand every delegate method
    let httpService: { patch: jest.Mock };

    beforeEach(async () => {
        // Stub PrismaService.comment delegate
        prisma = {
            comment: {
                create:    jest.fn(),
                findMany:  jest.fn(),
                count:     jest.fn(),
                findUnique:jest.fn(),
                delete:    jest.fn(),
            },
        };

        // Stub HttpService.patch
        httpService = {
            patch: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommentsService,
                { provide: PrismaService, useValue: prisma as PrismaService },
                { provide: HttpService,    useValue: httpService },
            ],
        }).compile();

        service = module.get(CommentsService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('create()', () => {
        const dto = {
            text:        'Nice read!',
            articleId:   'art1',
            isAnonymous: false,
            parentId:    undefined,
        };

        it('creates a comment and patches count', async () => {
            // Stub create
            const fakeComment = { id: 'c1', ...dto, user: { id: 2 }, createdAt: new Date() };
            prisma.comment.create.mockResolvedValue(fakeComment);
            // Stub countByArticle (called inside create)
            prisma.comment.count.mockResolvedValue(7);
            // Stub HTTP patch to return an observable
            httpService.patch.mockReturnValue(of({ status: 200 }));

            const result = await service.create(1, dto);

            // comment.create called with correct data
            expect(prisma.comment.create).toHaveBeenCalledWith({
                data: {
                    text:        dto.text,
                    articleId:   dto.articleId,
                    isAnonymous: dto.isAnonymous,
                    parentId:    null,
                    userId:      1,
                },
                include: { user: true },
            });

            // count called on same articleId
            expect(prisma.comment.count).toHaveBeenCalledWith({ where: { articleId: dto.articleId } });

            // HTTP patch called with correct URL and count
            expect(httpService.patch).toHaveBeenCalledWith(
                `${process.env.NEWS_SERVICE_URL}/articles/${dto.articleId}/comments-count`,
                { count: 7 }
            );

            expect(result).toBe(fakeComment);
        });
    });

    describe('getByArticle()', () => {
        it('queries findMany with correct filters and sort', async () => {
            const fakeList = [{ id:'c1', text:'x' }];
            prisma.comment.findMany.mockResolvedValue(fakeList);

            const res = await service.getByArticle('art2');

            expect(prisma.comment.findMany).toHaveBeenCalledWith({
                where:   { articleId: 'art2' },
                include: { user: true },
                orderBy:{ createdAt: 'asc' },
            });
            expect(res).toBe(fakeList);
        });
    });

    describe('countByArticle()', () => {
        it('calls count with correct where clause', async () => {
            prisma.comment.count.mockResolvedValue(3);
            const res = await service.countByArticle('art3');
            expect(prisma.comment.count).toHaveBeenCalledWith({ where: { articleId: 'art3' } });
            expect(res).toBe(3);
        });
    });

    describe('deleteComment()', () => {
        it('returns false if comment not found', async () => {
            prisma.comment.findUnique.mockResolvedValue(null);
            const res = await service.deleteComment('nope', 5);
            expect(res).toBe(false);
        });

        it('returns false if userId mismatch', async () => {
            prisma.comment.findUnique.mockResolvedValue({ id:'c2', userId: 9 });
            const res = await service.deleteComment('c2', 5);
            expect(res).toBe(false);
        });

        it('deletes and returns true if owner matches', async () => {
            prisma.comment.findUnique.mockResolvedValue({ id:'c3', userId: 5 });
            prisma.comment.delete.mockResolvedValue({ id:'c3' });

            const res = await service.deleteComment('c3', 5);
            expect(prisma.comment.delete).toHaveBeenCalledWith({ where: { id: 'c3' } });
            expect(res).toBe(true);
        });
    });
});
