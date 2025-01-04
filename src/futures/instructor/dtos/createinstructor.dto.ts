import { User } from "../../users/entities/user.entity";

export interface CreateInstructorDto {
    id: string;
    user: User;

}