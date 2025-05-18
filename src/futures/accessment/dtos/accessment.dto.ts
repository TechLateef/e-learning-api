import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ACCESSMENT_TYPES } from "../../../core/utils/enums";

export class CreateAccessmentDto {
  @IsString()
  @IsNotEmpty()
  accessmentType: ACCESSMENT_TYPES;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  instructorId: string;

  @IsNumber()
  @IsNotEmpty()
  maxGrade: number;
}
