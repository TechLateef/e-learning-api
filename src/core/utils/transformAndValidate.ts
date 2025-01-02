import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Utility to transform and validate a DTO.
 * @param dtoClass The class to transform the plain object into.
 * @param plainObject The plain object to validate.
 * @returns The transformed and validated DTO.
 * @throws Error if validation fails.
 */
export async function transformAndValidate<T extends object>(dtoClass: new () => T, plainObject: object): Promise<T> {
    const dto = plainToClass(dtoClass, plainObject);
    const errors: ValidationError[] = await validate(dto);

    if (errors.length > 0) {
        const constraints = errors.flatMap((error) => Object.values(error.constraints || {}));
        throw new Error(`Validation failed: ${constraints.join(', ')}`);
    }

    return dto;
}
