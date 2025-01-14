import { CreateUserDto } from "../../futures/users/dtos/createUser.dto";
import swaggerJsDoc from "swagger-jsdoc";

function generateSchema(dto: any) {
  const schema: Record<string, any> = { type: "object", properties: {} };
  for (const key of Object.keys(dto.prototype)) {
    const description = Reflect.getMetadata(`swagger:${key}`, dto.prototype);
    if (description) {
      schema.properties[key] = { type: "string", description };
    }
  }
  return schema;
}

 const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth API",
      version: "1.0.0",
    },
    components: {
      schemas: {
        CreateUserDto: generateSchema(CreateUserDto),
      },
    },
  },
  apis: ['../futures/**/router/*.route.ts'],
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);

