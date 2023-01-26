import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGard } from 'src/auth/auth.guard';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { CreateAccountInput } from './entities/dtos/create-account.dto';
import {
  EditProfileInput,
  EditProfileOutput,
} from './entities/dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './entities/dtos/login.dto';
import {
  UserProfileInput,
  UserProfileOutput,
} from './entities/dtos/user-profile.dto';
import { User } from './entities/user.entity';
import { UsersService } from './user.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
  @Mutation(() => CoreOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CoreOutput> {
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
  @UseGuards(AuthGard)
  me(@AuthUser() authUser: User) {
    return authUser;
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

  @UseGuards(AuthGard)
  @Query(() => UserProfileOutput)
  async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    try {
      const user = await this.usersService.findById(userProfileInput.userId);
      if (!user) {
        throw Error();
      }
      return {
        ok: true,
        user,
      };
    } catch (e) {
      return {
        ok: false,
        error: 'User is not Found',
      };
    }
  }

  @UseGuards(AuthGard)
  @Mutation(() => EditProfileOutput)
  async editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      await this.usersService.editProfile(authUser.id, editProfileInput);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
