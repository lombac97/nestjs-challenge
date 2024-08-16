import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './../../users/models/user.entity';
import { CreateUserDto } from '../controllers/dto/create-user.dto';
import { RolesService } from '../../users/services/roles/roles.service';
import { roleNames } from '../../constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private jwtService: JwtService,
  ) {}

  async validateUserLocal(email: string, password: string): Promise<any> {
    const user: User = await this.usersService.findOneByEmail(email);
    if (
      user &&
      (await this.usersService.comparePassword(password, user.password))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { userId: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async userExists(email: string) {
    return await this.usersService.findOneByEmail(email);
  }

  async createUser(userDto: CreateUserDto) {
    // Users will be created with guest role by default
    const guestRole = await this.rolesService.findOneByName(roleNames.GUEST);

    const user: User = await this.usersService.create(userDto);
    user.roles = [guestRole];
    const payload = { userId: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
