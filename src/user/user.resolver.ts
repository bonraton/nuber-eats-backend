import { Args, Context, Mutation, Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { CreateAccountInput } from './entities/dtos/create-account.dto';
import { LoginInput, LoginOutput } from './entities/dtos/login.dto';
import { User } from './entities/user.entity';
import { UsersService } from './user.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
  @Query(() => User)
  @Mutation(() => MutationOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<MutationOutput> {
    try {
      return this.usersService.createAccount(createAccountInput);
    } catch (e) {
      return {
        ok: false,
        error: e,
      };
    }
  }

  @Query(() => User)
  getMe(@Context() context) {
    console.log(context.user);
  }

  @Mutation(() => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      return this.usersService.login(loginInput);
    } catch (error) {
      return {
        ok: false,
        error: error,
      };
    }
  }
}
