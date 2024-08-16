import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  ArrayNotEmpty,
  IsString,
  IsEmail,
} from 'class-validator';
import { roleNames } from '../../../constants';

export class AssignRolesDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email to assign roles',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: [
      roleNames.ADMIN,
      roleNames.AGENT,
      roleNames.CUSTOMER,
      roleNames.GUEST,
    ],
    description: 'Roles name array to assign',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  roleNames: string[];
}
