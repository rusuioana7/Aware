// tests/auth.service.spec.ts

import { Test, TestingModule }        from '@nestjs/testing';
import { BadRequestException }        from '@nestjs/common';
import * as bcrypt                     from 'bcryptjs';
import { JwtService }                 from '@nestjs/jwt';
import { AuthService }                from '../src/auth/auth.service';
import { PrismaService }              from '../src/prisma/prisma.service';
import { RegisterUserDto }            from '../src/auth/dto/register-user.dto';
import { User }                       from '@prisma/client';

describe('AuthService (unit)', () => {
    let service: AuthService;
    let prisma: Partial<PrismaService>;
    let jwtService: Partial<JwtService>;

    beforeEach(async () => {
        // create mocks for PrismaService and JwtService
        prisma = {
            user: {
                findUnique: jest.fn(),
                create:     jest.fn(),
            },
            bookmarkFolder: {
                create:     jest.fn(),
            },
        } as any;

        jwtService = {
            sign: jest.fn().mockReturnValue('signed-token'),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: PrismaService, useValue: prisma },
                { provide: JwtService,    useValue: jwtService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('register()', () => {
        const dto: RegisterUserDto = {
            email:           'test@example.com',
            password:        'Passw0rd!',
            confirmPassword: 'Passw0rd!',
        };

        it('throws if passwords do not match', async () => {
            await expect(
                service.register({ ...dto, confirmPassword: 'nope' }),
            ).rejects.toThrow(BadRequestException);
        });

        it('throws if email already registered', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 } as User);
            await expect(service.register(dto)).rejects.toThrow(BadRequestException);
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { email: dto.email },
            });
        });

        it('creates user and default folder on success', async () => {
            // no existing user
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            // stub bcrypt.hash
            // @ts-ignore
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-pass');
            // simulate user.create returning the new user
            const createdUser = { id: 42, email: dto.email, password: 'hashed-pass' } as User;
            (prisma.user.create as jest.Mock).mockResolvedValue(createdUser);
            (prisma.bookmarkFolder.create as jest.Mock).mockResolvedValue({});

            const result = await service.register(dto);

            expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: { email: dto.email, password: 'hashed-pass' },
            });
            expect(prisma.bookmarkFolder.create).toHaveBeenCalledWith({
                data: {
                    name: 'Save for Later',
                    color: '#999999',
                    articleIds: [],
                    user: { connect: { id: createdUser.id } },
                },
            });
            expect(result).toEqual(createdUser);
        });
    });

    describe('validateUser()', () => {
        const plain = 'my-password';
        const hashed = 'hashed';
        const userRec = { id: 5, email: 'x@y.z', password: hashed } as User;

        it('returns null if no user found', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            await expect(service.validateUser('foo', plain)).resolves.toBeNull();
        });

        it('returns null if password missing', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, email: 'a@b.c', password: null } as any);
            await expect(service.validateUser('a@b.c', plain)).resolves.toBeNull();
        });

        it('returns null on wrong password', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(userRec);
            // @ts-ignore
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
            await expect(service.validateUser(userRec.email, plain)).resolves.toBeNull();
        });

        it('returns user on correct password', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(userRec);
            // @ts-ignore
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
            await expect(service.validateUser(userRec.email, plain)).resolves.toEqual(userRec);
        });
    });

    describe('login()', () => {
        it('returns a signed JWT token', () => {
            const user = { id: 7, email: 'u@d.e' } as User;
            const res = service.login(user);
            expect(jwtService.sign).toHaveBeenCalledWith({ email: user.email, sub: user.id });
            expect(res).toEqual({ access_token: 'signed-token' });
        });
    });

    describe('googleLogin()', () => {
        const googleUser = { email: 'g@h.i', name: 'GoogleUser', provider: 'google' };

        it('signup mode: throws if account exists', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 8 } as User);
            await expect(service.googleLogin(googleUser, 'signup')).rejects.toThrow(BadRequestException);
        });

        it('signup mode: creates new user, folder, and returns token', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            const newUser = { id: 9, email: googleUser.email, name: googleUser.name } as User;
            (prisma.user.create as jest.Mock).mockResolvedValue(newUser);
            (prisma.bookmarkFolder.create as jest.Mock).mockResolvedValue({});

            const res = await service.googleLogin(googleUser, 'signup');
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    email: googleUser.email,
                    name: googleUser.name,
                    provider: googleUser.provider,
                },
            });
            expect(prisma.bookmarkFolder.create).toHaveBeenCalled();
            expect(jwtService.sign).toHaveBeenCalledWith({ email: newUser.email, sub: newUser.id });
            expect(res).toEqual({ message: 'Registered and logged in with Google', token: 'signed-token' });
        });

        it('login mode: throws if account does not exist', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            await expect(service.googleLogin(googleUser, 'login')).rejects.toThrow(BadRequestException);
        });

        it('login mode: returns message and token if exists', async () => {
            const existing = { id: 10, email: googleUser.email } as User;
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(existing);

            const res = await service.googleLogin(googleUser, 'login');
            expect(jwtService.sign).toHaveBeenCalledWith({ email: existing.email, sub: existing.id });
            expect(res).toEqual({ message: 'Logged in with Google', token: 'signed-token' });
        });
    });
});
