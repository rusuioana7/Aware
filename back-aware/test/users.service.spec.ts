// tests/users.service.spec.ts

import { Test, TestingModule }             from '@nestjs/testing';
import { HttpService }                     from '@nestjs/axios';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt                         from 'bcrypt';

import { UsersService, UserProfile }       from '../src/users/users.service';
import { PrismaService }                   from '../src/prisma/prisma.service';
import {ThreadDto} from "../src/articles/dto/thread.dto";

describe('UsersService (unit)', () => {
    let service: UsersService;
    let prisma: any;
    let httpService: any;

    beforeEach(async () => {
        process.env.NEWS_SERVICE_URL = 'http://test.news';

        prisma = {
            user: {
                findUnique: jest.fn(),
                update:     jest.fn(),
            },
            threadFollow: {
                upsert:     jest.fn(),
                deleteMany: jest.fn(),
                findMany:   jest.fn(),
            },
        };

        httpService = {
            axiosRef: {
                post: jest.fn(),
                get:  jest.fn(),
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: PrismaService, useValue: prisma as PrismaService },
                { provide: HttpService,   useValue: httpService },
            ],
        }).compile();

        service = module.get(UsersService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('findById()', () => {
        it('returns profile when user exists', async () => {
            const user: UserProfile = {
                id: 1, email: 'a@b.c', name:'A', bio:'B',
                language:['en'], country:['US'], favoriteTopics:['t'],
                createdAt:new Date(), profilePhoto:null, bannerPhoto:null,
                recentViews:['x'], isPublic:true
            };
            prisma.user.findUnique.mockResolvedValue(user);

            const res = await service.findById(1);
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                select: {
                    id:true, email:true, name:true, bio:true,
                    language:true, country:true, favoriteTopics:true,
                    createdAt:true, profilePhoto:true, bannerPhoto:true,
                    recentViews:true,
                },
            });
            expect(res).toEqual(user);
        });

        it('throws NotFoundException if missing', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            await expect(service.findById(2)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateProfile()', () => {
        it('updates fields correctly', async () => {
            const dto = {
                name:'N', bio:'Bio', language:['f'], country:['R'],
                favoriteTopics:['x'], profilePhoto:'p', bannerPhoto:'b',
            };
            const ret = { id:1, email:'e@t', ...dto, createdAt:new Date() };
            prisma.user.update.mockResolvedValue(ret);

            // @ts-ignore
            const res = await service.updateProfile(1, dto);
            expect(prisma.user.update).toHaveBeenCalledWith({
                where:{ id:1 },
                data:{ ...dto },
                select:{
                    id:true, email:true, name:true, bio:true,
                    language:true, country:true, favoriteTopics:true,
                    createdAt:true, profilePhoto:true, bannerPhoto:true,

                },
            });
            expect(res).toEqual(ret);
        });
    });

    describe('updateEmail()', () => {
        it('throws if email in use', async () => {
            prisma.user.findUnique.mockResolvedValue({ id:3 });
            await expect(
                service.updateEmail(1, { newEmail:'dup@e' })
            ).rejects.toThrow(BadRequestException);
        });

        it('updates to new email', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            const ret = { id:1, email:'n@e' };
            prisma.user.update.mockResolvedValue(ret);

            const res = await service.updateEmail(1, { newEmail:'n@e' });
            expect(prisma.user.update).toHaveBeenCalledWith({
                where:{ id:1 },
                data:{ email:'n@e' },
                select:{ id:true, email:true },
            });
            expect(res).toEqual(ret);
        });
    });

    describe('updatePassword()', () => {
        it('hashes and updates password', async () => {
            // @ts-ignore
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hsh');
            prisma.user.update.mockResolvedValue(undefined);

            const res = await service.updatePassword(5, { newPassword:'pwd' });
            expect(bcrypt.hash).toHaveBeenCalledWith('pwd', 10);
            expect(prisma.user.update).toHaveBeenCalledWith({
                where:{ id:5 },
                data:{ password:'hsh' },
            });
            expect(res).toEqual({ id:5 });
        });
    });

    describe('updateNotifications()', () => {
        it('updates notification prefs', async () => {
            const dto = {
                notifyWeeklyEmail:true, notifyDailyEmail:false,
                notifyTopicAlertsEmail:true, notifyWeeklyPush:false,
                notifyDailyPush:true, notifyTopicAlertsPush:false,
            };
            const ret = { id:1, ...dto };
            prisma.user.update.mockResolvedValue(ret);

            const res = await service.updateNotifications(1, dto);
            expect(prisma.user.update).toHaveBeenCalledWith({
                where:{ id:1 },
                data:{ ...dto },
                select:{
                    id:true, notifyWeeklyEmail:true, notifyDailyEmail:true,
                    notifyTopicAlertsEmail:true, notifyWeeklyPush:true,
                    notifyDailyPush:true, notifyTopicAlertsPush:true,
                },
            });
            expect(res).toEqual(ret);
        });
    });

    describe('updateVisibility()', () => {
        it('toggles isPublic', async () => {
            const ret = { id:2, isPublic:true };
            prisma.user.update.mockResolvedValue(ret);
            const res = await service.updateVisibility(2, { isPublic:true });
            expect(prisma.user.update).toHaveBeenCalledWith({
                where:{ id:2 },
                data:{ isPublic:true },
                select:{ id:true, isPublic:true },
            });
            expect(res).toEqual(ret);
        });
    });

    describe('unlinkOauth()', () => {
        it('throws if user not found', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            await expect(
                service.unlinkOauth(1, { provider:'g' })
            ).rejects.toThrow(NotFoundException);
        });

        it('throws on provider mismatch', async () => {
            prisma.user.findUnique.mockResolvedValue({ provider:'f', providerId:'id' });
            await expect(
                service.unlinkOauth(1, { provider:'g' })
            ).rejects.toThrow(BadRequestException);
        });

        it('unlinks and returns', async () => {
            prisma.user.findUnique.mockResolvedValue({ provider:'g', providerId:'id' });
            const ret = { id:1, provider:null, providerId:null };
            prisma.user.update.mockResolvedValue(ret);

            const res = await service.unlinkOauth(1, { provider:'g' });
            expect(prisma.user.update).toHaveBeenCalledWith({
                where:{ id:1 },
                data:{ provider:null, providerId:null },
                select:{ id:true, provider:true, providerId:true },
            });
            expect(res).toEqual(ret);
        });
    });

    describe('exportUserData()', () => {
        it('throws if missing', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            await expect(service.exportUserData(3)).rejects.toThrow(NotFoundException);
        });
        it('returns full user', async () => {
            const fake = { id:3, email:'e', name:null, bio:null, language:[], country:[], favoriteTopics:[], createdAt:new Date(), profilePhoto:null, bannerPhoto:null, recentViews:[], provider:'g', providerId:'i', isPublic:true, notifyWeeklyEmail:false, notifyDailyEmail:false, notifyTopicAlertsEmail:false, notifyWeeklyPush:false, notifyDailyPush:false, notifyTopicAlertsPush:false };
            prisma.user.findUnique.mockResolvedValue(fake);
            const res = await service.exportUserData(3);
            expect(res).toEqual(fake);
        });
    });

    describe('trackViewedArticle()', () => {
        it('updates recentViews and posts to news service', async () => {
            const user = { recentViews:['a','b','c','d','e','f'] };
            prisma.user.findUnique.mockResolvedValue(user);
            prisma.user.update.mockResolvedValue(undefined);
            httpService.axiosRef.post.mockResolvedValue({});

            await service.trackViewedArticle(4,'x');
            expect(prisma.user.update).toHaveBeenCalledWith({
                where:{ id:4 },
                data:{ recentViews:['x','a','b','c','d'] },
            });
            expect(httpService.axiosRef.post).toHaveBeenCalledWith(
                'http://test.news/articles/x/track-view'
            );
        });

        it('swallows http errors', async () => {
            prisma.user.findUnique.mockResolvedValue({ recentViews:[] });
            prisma.user.update.mockResolvedValue(undefined);
            httpService.axiosRef.post.mockRejectedValue(new Error('fail'));

            await expect(service.trackViewedArticle(4,'x')).resolves.toBeUndefined();
        });
    });

    describe('getRecentArticleIds()', () => {
        it('returns array if exists', async () => {
            prisma.user.findUnique.mockResolvedValue({ recentViews:['u'] });
            const res = await service.getRecentArticleIds(5);
            expect(res).toEqual(['u']);
        });
        it('returns empty if missing', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            const res = await service.getRecentArticleIds(5);
            expect(res).toEqual([]);
        });
    });

    describe('followThread()', () => {
        it('upserts follow', async () => {
            prisma.threadFollow.upsert.mockResolvedValue({});
            await service.followThread(1,'t1');
            expect(prisma.threadFollow.upsert).toHaveBeenCalledWith({
                where:{ userId_threadId:{ userId:1, threadId:'t1' } },
                update:{},
                create:{ userId:1, threadId:'t1' },
            });
        });
    });

    describe('unfollowThread()', () => {
        it('deletes follow entries', async () => {
            prisma.threadFollow.deleteMany.mockResolvedValue({ count:1 });
            await service.unfollowThread(2,'t2');
            expect(prisma.threadFollow.deleteMany).toHaveBeenCalledWith({
                where:{ userId:2, threadId:'t2' },
            });
        });
    });

    describe('getFollowedThreads()', () => {
        it('fetches threads, filters failures', async () => {
            prisma.threadFollow.findMany.mockResolvedValue([{ threadId:'t1' },{ threadId:'t2' }]);
            const t1: { id: string; articles: any[] } = { id:'t1', articles:[]};
            httpService.axiosRef.get
                .mockResolvedValueOnce({ data:t1 })
                .mockRejectedValueOnce(new Error('404'));

            const res = await service.getFollowedThreads(3);
            expect(res).toEqual([t1]);
        });
    });
});
