import { registerDecorator, ValidateByOptions } from "class-validator";

/**
 * Custorm Swagger decorator for request DTOs
 * 
 */


export function ApiSchema(description: string): PropertyDecorator {
    return function (target: Object, propertyKey: string | symbol) {
        Reflect.defineMetadata(`swagger:${String(propertyKey)}`, description, target)
    }
}