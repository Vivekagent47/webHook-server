import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User, UserRole } from "src/entities";

export interface IAuthUserDecorator {
  role: UserRole;
  email: string;
  user: User;
  orgId: string;
}

export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);
