import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";
import { ROLE } from "../../../core/utils/enums";
import { User } from "../../users/entities/user.entity";
import { Exclude, Expose } from "class-transformer";

export class EditProfileDto {
  @IsUrl()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  profileUrl?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  OTP: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class TwoFAValidationDTO {
  @IsString()
  @IsNotEmpty()
  tempToken: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class VerifyAndEnable2FADto {
  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
export class GenerateOTPDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class GetProfileDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class UpdateUserProfileDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  fullName: string;

  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  profileUrl: string;
}

export class UserResponseDTO {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Exclude()
  password: string;

  @Exclude()
  otpAscii: string;

  @Exclude()
  otpHex: string;

  @Exclude()
  otpBase32: string;

  @Exclude()
  otpAuthUrl: string;

  @Exclude()
  passwordResetOTP: string;

  @Exclude()
  resetOTPExpiresAt: Date;

  @Exclude()
  otpExpiresAt: Date;
}
