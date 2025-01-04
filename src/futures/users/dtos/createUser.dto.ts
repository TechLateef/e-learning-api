import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator"
import { ROLE } from "../../../core/utils/enums"

export class CreateUserDto {

    @IsUUID()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsNotEmpty()
    @IsEnum(ROLE)
    role: ROLE;

}