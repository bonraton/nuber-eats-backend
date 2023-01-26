import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGard implements CanActivate {
  // should return boolean value
  canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext(); // convert ExecutrionContext to GqlContext
    const user = gqlContext['user'];
    return !user ? false : true; // if true, guard allows to continue execution
  }
}
