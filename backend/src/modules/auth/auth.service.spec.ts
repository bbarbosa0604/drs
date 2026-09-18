import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('getProfile returns the PublicUser shape (with id), not the internal RequestUser shape', async () => {
    const usersService = {
      findOne: jest.fn().mockResolvedValue({
        id: 'user-1',
        name: 'Bruno',
        email: 'bruno@example.com',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      buildRequestUser: jest.fn(),
    };
    const jwtService = { signAsync: jest.fn() };

    const service = new AuthService(usersService as never, jwtService as never);

    const profile = await service.getProfile('user-1');

    expect(usersService.findOne).toHaveBeenCalledWith('user-1');
    expect(usersService.buildRequestUser).not.toHaveBeenCalled();
    expect(profile).toEqual(
      expect.objectContaining({ id: 'user-1', email: 'bruno@example.com' }),
    );
  });
});
