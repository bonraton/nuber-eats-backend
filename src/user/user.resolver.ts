// import { Query } from '@nestjs/common';
import { Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';

@Resolver(() => User)
export class UserResover {
  @Query(() => [User])
  users(): any {
    return [];
  }
}
