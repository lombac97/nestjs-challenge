import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from '../../../users/models/user.entity';
import { RolesService } from '../roles/roles.service';
import { roleNames } from '../../../constants';
jest.mock('bcryptjs', () => {
  return {
    compare: jest.fn().mockImplementation(() => Promise.resolve(true)),
    hash: jest.fn().mockImplementation(() => Promise.resolve('hashedPass')),
  };
});

describe('UsersService', () => {
  let usersService: UsersService;
  let mockUser;

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(() => Promise.resolve(mockUser)),
    create: jest.fn(),
  };
  const mockRoleService = {
    findOneByName: jest.fn(),
    findBy: jest.fn(),
  };

  beforeEach(async () => {
    mockUser = {
      id: 1,
      email: 'demo@demo.com',
      first_name: 'John',
      last_name: 'Doe',
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: RolesService, useValue: mockRoleService },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should find a user by email', async () => {
    mockUserRepository.findOne.mockReturnValueOnce(mockUser);
    const result = await usersService.findOneByEmail(mockUser.email);
    expect(result).toEqual(mockUser);
  });

  it('should find a user by id', async () => {
    mockUserRepository.findOne.mockReturnValueOnce(mockUser);
    const result = await usersService.findOneById(mockUser.id);
    expect(result).toEqual(mockUser);
  });

  it('should find a user by id', async () => {
    mockRoleService.findOneByName.mockReturnValueOnce({ name: 'guest', id: 1 });
    mockUserRepository.create.mockReturnValueOnce(mockUser);
    const result = await usersService.create(mockUser);

    expect(result).toEqual(mockUser);
  });

  it('should assign role to a user', async () => {
    mockUserRepository.findOne.mockReturnValue(mockUser);
    mockRoleService.findBy.mockReturnValueOnce([
      { name: roleNames.AGENT, id: 2 },
    ]);
    const result = await usersService.assignRoles({
      email: 'demo@demo.com',
      roleNames: [roleNames.AGENT],
    });

    expect(result).toEqual({
      ...mockUser,
      roles: [{ name: roleNames.AGENT, id: 2 }],
    });
  });
});
