import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../../models/user.entity';
import { CreateUserDto } from '../../../auth/controllers/dto/create-user.dto';
import { AssignRolesDto } from '../../controllers/dto/assign-role.dto';
import * as bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { RolesService } from '../roles/roles.service';
import { roleNames } from '../../../constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await this.encryptPassword(createUserDto.password);
    const guestRole = await this.rolesService.findOneByName(roleNames.GUEST);
    const user: User = await this.userRepository.create({
      ...createUserDto,
      roles: [guestRole],
    });
    return await this.userRepository.save(user);
  }

  async encryptPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async assignRoles(assignRoleDto: AssignRolesDto): Promise<User> {
    const { email, roleNames } = assignRoleDto;

    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const roles = await this.rolesService.findBy({
      name: In(roleNames),
    });
    if (!roles.length) {
      throw new NotFoundException('None of the roles exist');
    }

    user.roles = roles;
    const userResponse = this.userRepository.save(user);
    return plainToClass(User, userResponse);
  }
}
