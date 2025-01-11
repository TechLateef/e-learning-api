import { IsNumber, IsString, IsUrl, IsUUID } from "class-validator";

export class CreateModuleDto {
  @IsUUID()
  courseId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  order: number;

  @IsUrl()
  contentUrl: string[];

  @IsUrl()
  videoUrl: string[];
}

export class UpdateModuleDto {
  @IsUUID()
  moduleId: string;

  @IsString()
  title: string;

  @IsNumber()
  order: number;


}
