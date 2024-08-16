import { In } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { Role } from '../../../users/models/role.entity';
import { roleNames } from '../../../constants';

describe('RolesService', () => {
  let rolesService: RolesService;

  const mockRolesRepository = {
    findOne: jest.fn().mockImplementation(({ where }) => {
      const name = where.name;
      return { id: 1, name };
    }),
    findBy: jest.fn().mockImplementation((where) => {
      const names = where.name._value;
      if (!names.length) {
        throw Error();
      }
      return names.map((name, index) => ({
        id: index + 1,
        name,
      }));
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useValue: mockRolesRepository,
        },
      ],
    }).compile();

    rolesService = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(rolesService).toBeDefined();
  });

  it('should return role by name', async () => {
    let result;
    result = await rolesService.findOneByName(roleNames.AGENT);
    expect(result).toEqual({ id: 1, name: roleNames.AGENT });

    result = await rolesService.findOneByName(roleNames.ADMIN);
    expect(result).toEqual({ id: 1, name: roleNames.ADMIN });

    result = await rolesService.findOneByName(roleNames.CUSTOMER);
    expect(result).toEqual({ id: 1, name: roleNames.CUSTOMER });

    result = await rolesService.findOneByName(roleNames.GUEST);
    expect(result).toEqual({ id: 1, name: roleNames.GUEST });
  });

  it('should return roles list by input list names', async () => {
    let result;
    let inputRoleNames;

    // Test with admin and customer
    inputRoleNames = [roleNames.ADMIN, roleNames.CUSTOMER];
    result = await rolesService.findBy({
      name: In(inputRoleNames),
    });

    expect(result).toEqual(
      expect.arrayContaining([
        {
          id: 1,
          name: roleNames.ADMIN,
        },
        {
          id: 2,
          name: roleNames.CUSTOMER,
        },
      ]),
    );

    // Test with agent and guest
    inputRoleNames = [roleNames.AGENT, roleNames.GUEST];
    result = await rolesService.findBy({
      name: In(inputRoleNames),
    });

    expect(result).toEqual(
      expect.arrayContaining([
        {
          id: 1,
          name: roleNames.AGENT,
        },
        {
          id: 2,
          name: roleNames.GUEST,
        },
      ]),
    );
  });
});
