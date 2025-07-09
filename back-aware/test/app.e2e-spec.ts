// tests/app.e2e-spec.ts

import { INestApplication, ExecutionContext, HttpStatus } from '@nestjs/common';
import { Test, TestingModule }                            from '@nestjs/testing';
const nock    = require('nock');
const request = require('supertest');
import { AppModule }         from '../src/app.module';
import { JwtAuthGuard }      from '../src/auth/jwt-auth.guard';
import { AuthGuard }         from '@nestjs/passport';
import { AdminGuard }        from '../src/auth/admin.guard';

import { PrismaService }     from '../src/prisma/prisma.service';
import { AuthService }       from '../src/auth/auth.service';
import { HttpService }       from '@nestjs/axios';

import { ArticlesService }   from '../src/articles/articles.service';
import { ThreadsService }    from '../src/threads/threads.service';
import { FeedService }       from '../src/feed/feed.service';
import { CommentsService }   from '../src/comments/comments.service';
import { BookmarksService }  from '../src/bookmarks/bookmarks.service';
import { UsersService }      from '../src/users/users.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  // --- dummy data ---
  const fakeArticle = {
    id: 'A1', title: 'T', author: 'Au', source: 'S',
    published: 'P', content: 'C', language: 'en',
    url: '', credibility_label: '', topics: []
  };
  const fakeThread = {
    id: 'T1', articles: ['A1'], topic: 'tech', image: null
  };
  const fakeUser = {
    id: 9, email: 'u@e', name: 'N', bio: 'B',
    language: ['en'], country: ['US'],
    favoriteTopics: ['t'], createdAt: new Date(),
    profilePhoto: null, bannerPhoto: null,
    recentViews: [], isPublic: true
  };
  const now = new Date();
  const fakeFolder = {
    id: 'F1', name: 'Folder', color: '#fff', starred: false,
    parentId: null, articleIds: [], threadIds: [],
    createdAt: now, updatedAt: now
  };

  // --- service stubs ---

  const articlesService = {
    findOne: jest.fn().mockResolvedValue(fakeArticle),
    findAll: jest.fn().mockResolvedValue([fakeArticle]),
    delete: jest.fn().mockResolvedValue(undefined),
    generateArticleFile: jest.fn().mockResolvedValue({
      mimeType: 'text/plain',
      filename: 'T.txt',
      buffer: Buffer.from('hi')
    }),
    generateAudio: jest.fn().mockResolvedValue(Buffer.from([1,2,3])),
    report: jest.fn().mockResolvedValue(undefined),
  };
  const threadsService = {
    findOne: jest.fn().mockResolvedValue(fakeThread),
    findAll: jest.fn().mockResolvedValue([fakeThread]),
    delete: jest.fn().mockResolvedValue(undefined),
  };
  const feedService = {
    getFeed: jest.fn().mockResolvedValue({
      articles: [fakeArticle],
      threads: [fakeThread]
    }),
  };
  const commentsService = {
    create: jest.fn().mockResolvedValue({
      id: 'C1', text: 'x', articleId: 'A1',
      isAnonymous: false, user: { id:9 }, createdAt: new Date()
    }),
    getByArticle: jest.fn().mockResolvedValue([{ id:'C1', text:'x' }]),
    countByArticle: jest.fn().mockResolvedValue(5),
    deleteComment: jest.fn().mockResolvedValue(true),
  };
  const bookmarksService = {
    createFolder: jest.fn().mockResolvedValue(fakeFolder),
    addArticleToFolder: jest.fn().mockResolvedValue(fakeFolder),
    addThreadToFolder: jest.fn().mockResolvedValue(fakeFolder),
    getSaveForLaterFolder: jest.fn().mockResolvedValue(fakeFolder),
    getAllArticlesInFolder: jest.fn().mockResolvedValue([fakeArticle]),
    getThreadsFromFolder: jest.fn().mockResolvedValue([fakeThread]),
    getFolderById: jest.fn().mockResolvedValue(fakeFolder),
    removeFolder: jest.fn().mockResolvedValue({}),
    removeArticleFromFolder: jest.fn().mockResolvedValue({}),
    toggleStar: jest.fn().mockResolvedValue({ ...fakeFolder, starred: true }),
    getFolderTree: jest.fn().mockResolvedValue([fakeFolder]),
  };

  // usersService stub plus embedded prisma for settings/account
  const usersService = {
    findById: jest.fn().mockResolvedValue(fakeUser),
    updateProfile: jest.fn().mockResolvedValue(fakeUser),
    trackViewedArticle: jest.fn().mockResolvedValue(undefined),
    getRecentArticleIds: jest.fn().mockResolvedValue(['A1']),
    followThread: jest.fn().mockResolvedValue(undefined),
    unfollowThread: jest.fn().mockResolvedValue(undefined),
    getFollowedThreads: jest.fn().mockResolvedValue([fakeThread]),
    exportUserData: jest.fn().mockResolvedValue({ ...fakeUser, password: undefined }),
    updateEmail: jest.fn().mockResolvedValue({ id:9, email:'new@e' }),
    updatePassword: jest.fn().mockResolvedValue({ id:9 }),
    updateNotifications: jest.fn().mockResolvedValue({ id:9, notifyDailyEmail:true }),
    updateVisibility: jest.fn().mockResolvedValue({ id:9, isPublic:false }),
    unlinkOauth: jest.fn().mockResolvedValue({ id:9, provider:null, providerId:null }),

    // **for /settings/account**
    prisma: {
      user: {
        delete: jest.fn().mockResolvedValue({}),
      }
    }
  };

  // Prisma stub for AdminController
  const prismaStub = {
    user: {
      create: jest.fn().mockResolvedValue({ id: 9, email: 'x@x' }),
      findMany: jest.fn().mockResolvedValue([]),
      delete: jest.fn().mockResolvedValue({}),
    }
  };

  // AuthService stub for register/login
  const authStub = {
    register: jest.fn().mockResolvedValue({ id:9, email:'u@e' }),
    validateUser: jest.fn().mockResolvedValue(null),  // will override in the login test
    login: jest.fn().mockReturnValue({ access_token: 'TOKEN' }),
  };

  // HttpService stub to satisfy SearchController
  const httpStub = {
    axiosRef: {
      get: jest.fn().mockResolvedValue({
        data: { articles:[fakeArticle], threads:[fakeThread] }
      })
    }
  };

  beforeAll(async () => {
    // stub the external news‐service
    const NEWS = 'http://test.news';
    nock(NEWS).persist()
        .get('/search').query(true).reply(200, { articles:[fakeArticle], threads:[fakeThread] })
        .get('/feed').query(true).reply(200, { articles:[fakeArticle], threads:[fakeThread] })
        .get('/articles/A1').reply(200, fakeArticle)
        .get('/threads/T1').reply(200, fakeThread);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
        // make sure every JWT‐protected route has a req.user.id
        .overrideGuard(JwtAuthGuard).useValue({
          canActivate: (ctx: ExecutionContext) => {
            const req = ctx.switchToHttp().getRequest();
            req.user = { id: 9 };
            return true;
          },
        })
        .overrideGuard(AuthGuard('jwt')).useValue({
          canActivate: (ctx: ExecutionContext) => {
            const req = ctx.switchToHttp().getRequest();
            req.user = { id: 9 };  // for AuthController.deleteAccount, SettingsController, etc.
            return true;
          },
        })
        .overrideGuard(AuthGuard('google')).useValue({ canActivate: () => true })
        .overrideGuard(AdminGuard).useValue({ canActivate: () => true })

        // provide our stubs
        .overrideProvider(PrismaService).useValue(prismaStub)
        .overrideProvider(AuthService).useValue(authStub)
        .overrideProvider(HttpService).useValue(httpStub)

        .overrideProvider(ArticlesService).useValue(articlesService)
        .overrideProvider(ThreadsService).useValue(threadsService)
        .overrideProvider(FeedService).useValue(feedService)
        .overrideProvider(CommentsService).useValue(commentsService)
        .overrideProvider(BookmarksService).useValue(bookmarksService)
        .overrideProvider(UsersService).useValue(usersService)

        .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    nock.cleanAll();
  });

  // ----- ADMIN -----
  it('POST   /admin/users', () => {
    return request(app.getHttpServer())
        .post('/admin/users')
        .send({ email:'x@x', password:'p' })
        .expect(HttpStatus.CREATED)
        .expect(res => {
          expect(res.body).toEqual({ id: 9, email: 'x@x' });
        });
  });

  it('GET    /admin/users', () => {
    return request(app.getHttpServer())
        .get('/admin/users')
        .expect(200)
        .expect(Array.isArray);
  });

  it('DELETE /admin/users/:id', () => {
    return request(app.getHttpServer())
        .delete('/admin/users/9')
        .expect(200)
        .expect({ message: 'User 9 deleted' });
  });

  it('GET    /admin/articles', () => {
    return request(app.getHttpServer())
        .get('/admin/articles')
        .expect(200)
        .expect({ articles:[fakeArticle], threads:[fakeThread] });
  });

  it('DELETE /admin/articles/:id', () => {
    return request(app.getHttpServer())
        .delete('/admin/articles/A1')
        .expect(200);
  });

  it('GET    /admin/threads', () => {
    return request(app.getHttpServer())
        .get('/admin/threads')
        .expect(200)
        .expect({ articles:[fakeArticle], threads:[fakeThread] });
  });

  it('DELETE /admin/threads/:id', () => {
    return request(app.getHttpServer())
        .delete('/admin/threads/T1')
        .expect(200);
  });

  // ----- ARTICLES -----
  it('GET    /articles/:id', () => {
    return request(app.getHttpServer())
        .get('/articles/A1')
        .expect(200)
        .expect(fakeArticle);
  });

  it('GET    /articles', () => {
    return request(app.getHttpServer())
        .get('/articles')
        .expect(200)
        .expect([fakeArticle]);
  });

  it('GET    /articles/:id/download/:type', () => {
    return request(app.getHttpServer())
        .get('/articles/A1/download/txt')
        .expect(200)
        .then(res => {
          expect(res.header['content-type']).toContain('text/plain');
        });
  });

  it('GET    /articles/:id/audio', () => {
    return request(app.getHttpServer())
        .get('/articles/A1/audio')
        .expect(200)
        .then(res => {
          expect(res.header['content-type']).toContain('audio/mpeg');
        });
  });

  it('PATCH  /articles/:id/report', () => {
    return request(app.getHttpServer())
        .patch('/articles/A1/report')
        .expect(200)
        .expect({ message: 'Article reported' });
  });

  // ----- AUTH -----
  it('POST   /auth/register', () => {
    return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email:'a@b', password:'p', confirmPassword:'p' })
        .expect(201)
        .expect(res => expect(res.body.accessToken).toBeDefined());
  });

  it('POST   /auth/login', () => {
    authStub.validateUser = jest.fn().mockResolvedValue({ id:9, email:'u@e', password:'x' });
    return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email:'u@e', password:'x' })
        .expect(201)
        .expect(res => expect(res.body.accessToken).toBeDefined());
  });

  it('POST   /auth/logout', () => {
    return request(app.getHttpServer())
        .post('/auth/logout')
        .expect(201)   // now 201 Created
        .expect({ message:'Logged out successfully' });
  });


  // ----- BOOKMARKS -----
  it('POST   /bookmarks', () => {
    return request(app.getHttpServer())
        .post('/bookmarks')
        .send({ name:'X' })
        .expect(201)
        .expect(res => {
          expect(res.body.id).toBe(fakeFolder.id);
          // dates come back as strings, so compare ISO
          expect(new Date(res.body.createdAt).toISOString()).toBe(now.toISOString());
          expect(new Date(res.body.updatedAt).toISOString()).toBe(now.toISOString());
        });
  });

  it('POST   /bookmarks/F1/articles/A1', () => {
    return request(app.getHttpServer())
        .post('/bookmarks/F1/articles/A1')
        .expect(201)
        .expect(res => expect(res.body.id).toBe(fakeFolder.id));
  });



  it('GET    /bookmarks/save-for-later', () => {
    return request(app.getHttpServer())
        .get('/bookmarks/save-for-later')
        .expect(200)
        .expect({ articles:[fakeArticle], threads:[fakeThread] });
  });

  it('GET    /bookmarks/F1', () => {
    return request(app.getHttpServer())
        .get('/bookmarks/F1')
        .expect(200)
        .expect(res => {
          expect(res.body.id).toBe(fakeFolder.id);
          expect(Array.isArray(res.body.articles)).toBe(true);
        });
  });

  it('DELETE /bookmarks/F1', () => {
    return request(app.getHttpServer())
        .delete('/bookmarks/F1')
        .expect(200);
  });

  it('DELETE /bookmarks/F1/articles/A1', () => {
    return request(app.getHttpServer())
        .delete('/bookmarks/F1/articles/A1')
        .expect(200);
  });

  it('PATCH  /bookmarks/F1/toggle-star', () => {
    return request(app.getHttpServer())
        .patch('/bookmarks/F1/toggle-star')
        .expect(200)
        .expect(res => expect(res.body.starred).toBe(true));
  });

  it('GET    /bookmarks', () => {
    return request(app.getHttpServer())
        .get('/bookmarks')
        .expect(200)
        .expect(Array.isArray);
  });

  // ----- COMMENTS -----
  it('POST   /comments/A1', () => {
    return request(app.getHttpServer())
        .post('/comments/A1')
        .send({ text:'x', isAnonymous:false })
        .expect(201)
        .expect(res => expect(res.body.id).toBe('C1'));
  });

  it('GET    /comments/A1', () => {
    return request(app.getHttpServer())
        .get('/comments/A1')
        .expect(200)
        .expect(Array.isArray);
  });

  it('GET    /comments/A1/count', () => {
    return request(app.getHttpServer())
        .get('/comments/A1/count')
        .expect(200)
        .expect({ count: 5 });
  });

  it('DELETE /comments/C1', () => {
    return request(app.getHttpServer())
        .delete('/comments/C1')
        .expect(200)
        .expect({ message:'Deleted successfully' });
  });

  // ----- FEED -----
  it('GET    /feed', () => {
    return request(app.getHttpServer())
        .get('/feed?feed_type=both&page=1&size=10&sort=published')
        .expect(200)
        .expect({ articles:[fakeArticle], threads:[fakeThread] });
  });

  // ----- SEARCH -----
  it('GET    /search?q=x', () => {
    return request(app.getHttpServer())
        .get('/search?q=foo&view=both&sort=published&page=1&size=20')
        .expect(200)
        .expect({ articles:[fakeArticle], threads:[fakeThread] });
  });

  // ----- THREADS -----
  it('GET    /threads/:id', () => {
    return request(app.getHttpServer())
        .get('/threads/T1')
        .expect(200)
        .expect(fakeThread);
  });

  it('GET    /threads', () => {
    return request(app.getHttpServer())
        .get('/threads')
        .expect(200)
        .expect([fakeThread]);
  });

  // ----- USERS -----
  it('GET    /users/me', () => {
    return request(app.getHttpServer())
        .get('/users/me')
        .expect(200)
        .expect(res => expect(res.body.email).toBe('u@e'));
  });

  it('PUT    /users/profile', () => {
    return request(app.getHttpServer())
        .put('/users/profile')
        .send({ name:'New' })
        .expect(200)
        .expect(res => expect(res.body.name).toBe('N'));
  });

  it('POST   /users/viewed/A1', () => {
    return request(app.getHttpServer())
        .post('/users/viewed/A1')
        .expect(201)
        .expect({ success:true });
  });

  it('GET    /users/recent-articles', () => {
    return request(app.getHttpServer())
        .get('/users/recent-articles')
        .expect(200)
        .expect(Array.isArray);
  });

  it('POST   /users/threads/T1/follow', () => {
    return request(app.getHttpServer())
        .post('/users/threads/T1/follow')
        .expect(201)
        .expect({ success:true });
  });

  it('DELETE /users/threads/T1/unfollow', () => {
    return request(app.getHttpServer())
        .delete('/users/threads/T1/unfollow')
        .expect(200)
        .expect({ success:true });
  });

  it('GET    /users/threads-followed', () => {
    return request(app.getHttpServer())
        .get('/users/threads-followed')
        .expect(200)
        .expect([fakeThread]);
  });

  // ----- SETTINGS -----
  it('GET    /settings/export', () => {
    return request(app.getHttpServer())
        .get('/settings/export')
        .expect(200)
        .expect(res => expect(res.body.id).toBe(9));
  });

  it('PUT    /settings/email', () => {
    return request(app.getHttpServer())
        .put('/settings/email')
        .send({ newEmail:'new@e' })
        .expect(200)
        .expect({ id:9, email:'new@e' });
  });

  it('PUT    /settings/password', () => {
    return request(app.getHttpServer())
        .put('/settings/password')
        .send({ newPassword:'p', confirmPassword:'p' })
        .expect(200)
        .expect({ id:9 });
  });

  it('PUT    /settings/notifications', () => {
    return request(app.getHttpServer())
        .put('/settings/notifications')
        .send({ notifyDailyEmail:true })
        .expect(200)
        .expect({ id:9, notifyDailyEmail:true });
  });

  it('PUT    /settings/visibility', () => {
    return request(app.getHttpServer())
        .put('/settings/visibility')
        .send({ isPublic:false })
        .expect(200)
        .expect({ id:9, isPublic:false });
  });

  it('DELETE /settings/unlink', () => {
    return request(app.getHttpServer())
        .delete('/settings/unlink')
        .send({ provider:'g' })
        .expect(200)
        .expect({ id:9, provider:null, providerId:null });
  });

  it('POST   /settings/logout', () => {
    return request(app.getHttpServer())
        .post('/settings/logout')
        .expect(200)
        .expect({ message:'Logged out successfully' });
  });

  it('DELETE /settings/account', () => {
    return request(app.getHttpServer())
        .delete('/settings/account')
        .expect(200)
        .expect({ message:'Account deleted successfully' });
  });
});