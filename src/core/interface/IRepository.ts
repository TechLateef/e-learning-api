import { ValidationError } from "class-validator";

export interface IRepository<T> {
    findAll(page: number, limit: number, categoryId?: number, search?: string): Promise<[T[], number]>;

    findById(Id: string | number): Promise<T | null>;

    create(itemData: Partial<T>): Promise<T | ValidationError[]>;

    // delete(id: number, user: Auth): Promise<void | T>;

    save(item: Partial<T>): Promise<T | ValidationError[]>;

    update(Id: string | number,updateData: Partial<T>): Promise<T | null>;
}