import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class EnrollStudentDTO {
    @IsString()
    @IsNotEmpty()
    courseId: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    studentId: string;
}