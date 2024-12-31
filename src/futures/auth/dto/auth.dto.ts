import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";
import { ROLE } from "../../../core/utils/enums";



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


export class LoginDTO {
       @IsString()
        @IsNotEmpty()
        email: string
    
        @IsString()
        @IsNotEmpty()
        password: string
    
}

export class ResetPasswordDTO {

    @IsString()
    @IsNotEmpty()
    OTP: string;

    @IsString()
    @IsNotEmpty()
    newPassword: string;
}