// import { Query } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './entities/dtos/create-account.dto';
import { User } from './entities/user.entity';
import { UsersService } from './user.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
  @Query(() => Boolean)
  hi() {
    return true;
  }
  @Mutation(() => CreateAccountOutput)
  createAccount(@Args('input') createAccountInput: CreateAccountInput) {
    return [];
  }
}
