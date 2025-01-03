import { plainToInstance } from "class-transformer";

/**
 * Converts an entity object into a Data Transfer Object (DTO) instance.
 *
 * @template T - The type of the DTO class.
 * @template U - The type of the entity object being transformed.
 * @param DTO - A constructor function for the DTO class.
 * @param entity - The entity object to be transformed.
 * @returns An instance of the DTO class with the entity's data.
 *
 * @example
 * // Assuming UserResponseDTO is a class with selected fields:
 * const userResponse = responseFormat(UserResponseDTO, userEntity);
 * console.log(userResponse); // Instance of UserResponseDTO
 */
export function responseFormat<T, U>(DTO: new () => T, entity: U): T {
  return plainToInstance(DTO, entity, {
    excludeExtraneousValues: true,
  });
}
