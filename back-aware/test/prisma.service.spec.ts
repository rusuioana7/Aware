// tests/prisma.service.spec.ts

import { PrismaService } from '../src/prisma/prisma.service';

describe('PrismaService', () => {
    let service: PrismaService;

    beforeEach(() => {
        service = new PrismaService();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should call $connect when onModuleInit is invoked', async () => {
        const connectSpy = jest
            .spyOn(service, '$connect')
            .mockResolvedValue(undefined);

        await service.onModuleInit();

        expect(connectSpy).toHaveBeenCalledTimes(1);
    });

    it('should call $disconnect when onModuleDestroy is invoked', async () => {
        const disconnectSpy = jest
            .spyOn(service, '$disconnect')
            .mockResolvedValue(undefined);

        await service.onModuleDestroy();

        expect(disconnectSpy).toHaveBeenCalledTimes(1);
    });
});
