import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ROLE } from "../../../core/utils/enums";
import { ApiSchema } from "../../../core/utils/swagger.decorator";

export class CreateUserDto {
  @ApiSchema("The user's username")
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiSchema("The user's email address")
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiSchema("The user's password")
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiSchema("The user's role")
  @IsNotEmpty()
  @IsEnum(ROLE)
  role: ROLE;
}
