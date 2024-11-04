// /express.d.ts
import { User } from './src/futures/auth/entities/auth.entity'

declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}