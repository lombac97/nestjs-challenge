import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import request from 'supertest';
import { AuthModule } from '../../src/auth/auth.module';
import { UsersModule } from '../../src/users/users.module';
import { SalesModule } from '../../src/sales/sales.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Agent } from '../../src/sales/models/agent.entity';
import { Customer } from '../../src/sales/models/customer.entity';
import { Order } from '../../src/sales/models/order.entity';
import { User } from '../../src/users/models/user.entity';
import { Role } from '../../src/users/models/role.entity';
import { roleNames } from '../../src/constants';

jest.mock('bcryptjs', () => {
  return {
    compare: jest.fn().mockImplementation(() => Promise.resolve(true)),
  };
});

describe('UsersControllers (e2e)', () => {
  let app: INestApplication;

  const agent = {
    agentCode: 'A001',
    agentName: 'Jhon Smith',
    workingArea: 'London',
    commission: '0.1',
    phoneNo: '077-12345674',
    country: 'USA',
  };

  const wrongRoleError = {
    message: 'You do not have access to this resource',
    error: 'Forbidden',
    statusCode: 403,
  };

  const mockUser = {
    id: 1,
    email: 'demo@demo.com',
    roles: [{ name: 'admin' }],
  };
  const mockAgentRepository = {
    find: jest.fn().mockImplementation(() => Promise.resolve([agent])),
    create: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
    save: jest.fn().mockImplementation((agent) => Promise.resolve(agent)),
    update: jest
      .fn()
      .mockImplementation((agentCode, updateAgentDto) =>
        Promise.resolve({ agentCode, ...updateAgentDto }),
      ),
    delete: jest.fn().mockImplementation(() =>
      Promise.resolve({
        raw: [],
        affected: 1,
      }),
    ),
  };

  const mockCustomerRepository = {};
  const mockOrderRepository = {};
  const mockRoleRepository = {
    findBy: jest.fn().mockImplementation(() => [{ name: 'admin' }]),
  };
  const mockUserRepository = {
    findOne: jest.fn().mockImplementation(() => mockUser),
    save: jest.fn().mockImplementation(() => mockUser),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        UsersModule,
        SalesModule,
      ],
    })
      .overrideProvider(getRepositoryToken(Agent))
      .useValue(mockAgentRepository)
      .overrideProvider(getRepositoryToken(Customer))
      .useValue(mockCustomerRepository)
      .overrideProvider(getRepositoryToken(Order))
      .useValue(mockOrderRepository)
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUserRepository)
      .overrideProvider(getRepositoryToken(Role))
      .useValue(mockRoleRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        stopAtFirstError: true,
      }),
    );
    await app.init();
  });

  const mockUserRole = (role: string) => {
    jest
      .spyOn(mockUserRepository, 'findOne')
      .mockReturnValue({ ...mockUser, roles: [{ name: role }] });
  };

  async function getValidToken() {
    const {
      body: { access_token },
    } = await request(app.getHttpServer()).post('/api/auth/login').send({
      email: 'demo@demo.com',
      password: 'demo',
    });
    return access_token;
  }

  it('/api/user/assign-roles (POST)', async () => {
    jest
      .spyOn(mockRoleRepository, 'findBy')
      .mockReturnValue([{ name: roleNames.CUSTOMER }]);

    jest
      .spyOn(mockUserRepository, 'findOne')
      .mockReturnValueOnce(mockUser)
      .mockReturnValueOnce(mockUser)
      .mockReturnValueOnce({
        ...mockUser,
        roles: [{ name: roleNames.CUSTOMER }],
      });

    jest.spyOn(mockUserRepository, 'save').mockReturnValueOnce({
      ...mockUser,
      roles: [{ name: roleNames.CUSTOMER }],
    });

    return request(app.getHttpServer())
      .post('/api/users/assign-roles')
      .auth(await getValidToken(), { type: 'bearer' })
      .send({ email: 'demo1@demo.com', roleNames: [roleNames.CUSTOMER] })
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .expect({
        id: 1,
        email: 'demo@demo.com',
        roles: [
          {
            name: roleNames.CUSTOMER,
          },
        ],
      });
  });

  it('/api/user/assign-roles (POST) should throw Bad Request', async () => {
    jest
      .spyOn(mockRoleRepository, 'findBy')
      .mockReturnValue([{ name: roleNames.CUSTOMER }]);

    return request(app.getHttpServer())
      .post('/api/users/assign-roles')
      .auth(await getValidToken(), { type: 'bearer' })
      .send({ email: 'demo1@demo.com', roleNames: [roleNames.CUSTOMER] })
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({
        message: 'Admin role cannot be changed',
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('/api/user/assign-roles (POST) should fail because of missing param', async () => {
    mockUserRole(roleNames.ADMIN);
    return request(app.getHttpServer())
      .post('/api/users/assign-roles')
      .auth(await getValidToken(), { type: 'bearer' })
      .send({ email: 'demo1@demo.com' })
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({
        message: ['each value in roleNames must be a string'],
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('/api/user/assign-roles (POST) should fail because of wrong role', async () => {
    mockUserRole(roleNames.GUEST);
    return request(app.getHttpServer())
      .post('/api/users/assign-roles')
      .auth(await getValidToken(), { type: 'bearer' })
      .send({ email: 'demo1@demo.com', roleNames: [roleNames.CUSTOMER] })
      .expect(403)
      .expect('Content-Type', /application\/json/)
      .expect(wrongRoleError);
  });
});
