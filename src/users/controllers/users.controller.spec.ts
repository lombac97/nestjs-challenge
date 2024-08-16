import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users/users.service';
import { roleNames } from '../../../src/constants';
import { AssignRolesDto } from './dto/assign-role.dto';

describe('UserController', () => {
  let userController: UsersController;
  const mockRoleAssignResponse = {
    id: 1,
    roles: [{ id: 3, name: roleNames.CUSTOMER }],
    email: 'demo@demo.com',
    first_name: 'John',
    last_name: 'Doe',
  };

  const mockUsersService = {
    assignRoles: jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockRoleAssignResponse)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    userController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });
  it('should return roles assigned', async () => {
    const newRequest = {
      email: 'demo@demo.com',
      roleNames: ['customer'],
    } as AssignRolesDto;
    const result = await userController.assignRoles(newRequest);
    expect(result).toEqual(mockRoleAssignResponse);
  });
});
