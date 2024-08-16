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

describe('SalesController (e2e)', () => {
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
    roles: [{ name: 'agent' }],
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
  const mockRoleRepository = {};
  const mockUserRepository = {
    findOne: jest.fn().mockImplementation(() => mockUser),
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

    mockUserRole(roleNames.AGENT);
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

  it('/api/agents (GET)', async () => {
    return request(app.getHttpServer())
      .get('/api/agents')
      .auth(await getValidToken(), { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect([agent]);
  });

  it('/api/agents (GET) should fail because of wrong role', async () => {
    mockUserRole(roleNames.CUSTOMER);
    return request(app.getHttpServer())
      .get('/api/agents')
      .auth(await getValidToken(), { type: 'bearer' })
      .expect(403)
      .expect('Content-Type', /application\/json/)
      .expect(wrongRoleError);
  });

  it('/api/agents (POST)', async () => {
    return request(app.getHttpServer())
      .post('/api/agents')
      .auth(await getValidToken(), { type: 'bearer' })
      .send(agent)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .expect(agent);
  });

  it('/api/agents (POST) should fail because of wrong role', async () => {
    mockUserRole(roleNames.CUSTOMER);
    return request(app.getHttpServer())
      .post('/api/agents')
      .auth(await getValidToken(), { type: 'bearer' })
      .send(agent)
      .expect(403)
      .expect('Content-Type', /application\/json/)
      .expect(wrongRoleError);
  });

  it('/api/agents (POST) should fail because missing parameters', async () => {
    return request(app.getHttpServer())
      .post('/api/agents')
      .auth(await getValidToken(), { type: 'bearer' })
      .send({})
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  it('/api/agents (UPDATE)', async () => {
    return request(app.getHttpServer())
      .patch('/api/agents/A001')
      .auth(await getValidToken(), { type: 'bearer' })
      .send({ agentName: 'Jhon Smith' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect({ agentCode: 'A001', agentName: 'Jhon Smith' });
  });

  it('/api/agents (UPDATE) should fail because of wrong role', async () => {
    mockUserRole(roleNames.CUSTOMER);
    return request(app.getHttpServer())
      .patch('/api/agents/A001')
      .auth(await getValidToken(), { type: 'bearer' })
      .send({ agentName: 'Jhon Smith' })
      .expect(403)
      .expect('Content-Type', /application\/json/)
      .expect(wrongRoleError);
  });

  it('/api/agents (UPDATE) should fail because invalid parameter', async () => {
    return request(app.getHttpServer())
      .patch('/api/agents/A001')
      .auth(await getValidToken(), { type: 'bearer' })
      .send({ agentName: 1 })
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  it('/api/agents (DELETE)', async () => {
    return request(app.getHttpServer())
      .delete('/api/agents/A001')
      .auth(await getValidToken(), { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect({
        raw: [],
        affected: 1,
      });
  });

  it('/api/agents (DELETE) should fail because of wrong role', async () => {
    mockUserRole(roleNames.CUSTOMER);
    return request(app.getHttpServer())
      .delete('/api/agents/A001')
      .auth(await getValidToken(), { type: 'bearer' })
      .expect(403)
      .expect('Content-Type', /application\/json/)
      .expect(wrongRoleError);
  });
});
