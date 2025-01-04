import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class SubmitAccessmentDto {
  @IsString()
  @IsNotEmpty()
  accementId: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  submissionContent: string;

  @IsString()
  @IsNotEmpty()
  fileUrl: string;
}

export class GradeSubmissionDto {
  @IsNumber()
  @IsNotEmpty()
  grade: number;

  @IsNumber()
  @IsNotEmpty()
  feedBack: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  instructorId: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  submissionId: string
}
