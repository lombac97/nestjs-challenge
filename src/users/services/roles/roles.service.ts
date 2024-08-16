import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../../../users/models/role.entity';

import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private repository: Repository<Role>) {}
  async findOneByName(name: string): Promise<Role | undefined> {
    return this.repository.findOne({
      where: {
        name,
      },
    });
  }

  async findBy(where: FindOptionsWhere<Role>): Promise<Role[] | undefined> {
    return this.repository.findBy(where);
  }
}
