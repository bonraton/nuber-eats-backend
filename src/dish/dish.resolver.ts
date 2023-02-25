import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/user/entities/user.entity';
import { DishService } from './dish.service';
import { CreateDishInput, CreateDishOutput } from './dtos/create-dish.dto';
import { Dish } from './entities/dish.entity';

@Resolver(() => Dish)
export class DishResolver {
  constructor(private readonly dishService: DishService) {}

  @Mutation(() => CreateDishOutput)
  @Role('Owner')
  async createDish(
    @AuthUser() owner: User,
    @Args('input') createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    return this.dishService.createDish(owner, createDishInput);
    // return this.dishService.createDish(createDishInput);
  }
}
