import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from "class-validator";

export class EnrollStudentDTO {
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  studentId: string;
}

export class FetchEnrollCourseQueryDTO {
  @IsOptional()
  @IsString()
  search?: string;

  @IsUUID()
  studentId: string

  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit: number = 10;
}
