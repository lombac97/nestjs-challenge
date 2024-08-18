import { Controller, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users/users.service';
import { AssignRolesDto } from './dto/assign-role.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { roleNames } from '../../constants';

@ApiTags('Roles')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(roleNames.ADMIN)
  @Post('assign-roles')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Assign roles to a user',
    schema: {
      example: {
        id: '1',
        firstName: 'Carlos',
        lastName: 'Gonzalez',
        email: 'carlitos@hotmail.com',
        roles: [
          {
            id: 4,
            name: 'guest',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    content: {
      'application/json': {
        examples: {
          userNotFound: {
            summary: 'User Not Found',
            value: {
              statusCode: 404,
              message: 'User does not exist',
              error: 'Not Found',
            },
          },
          roleNotFound: {
            summary: 'Roles Not Found',
            value: {
              statusCode: 404,
              message: 'None of the roles exist',
              error: 'Not Found',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    schema: {
      example: {
        message: 'You do not have access to this resource',
        error: 'Forbidden',
        statusCode: 403,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    schema: {
      example: {
        message: 'Admin role cannot be changed',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  assignRoles(@Body() assignRoleDto: AssignRolesDto) {
    return this.usersService.assignRoles(assignRoleDto);
  }
}
