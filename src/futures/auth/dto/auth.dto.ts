import { IsOptional, IsString, IsUrl } from "class-validator";
import { ROLE } from "../../../core/utils/enum";



export class EditProfileDto {
    @IsUrl()
    @IsOptional()
    bio?: string;

    @IsString()
    @IsOptional()
    profileUrl?: string;

    @IsString()
    @IsOptional()
    phone?: string
}



export interface CreateUserDto {
    username: string

    email: string

    password: string,

    role: ROLE

}