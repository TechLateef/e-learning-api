// /express.d.ts
import { User } from './src/futures/users/entities/user.entity'

declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}