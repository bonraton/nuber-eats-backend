import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';

import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurant.service';
import { Role } from 'src/auth/role.decorator';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant-dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';
import { RestaurantInput, RestaurantOutput } from './dtos/restaurant.dto';
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from './dtos/search-restaurant.dto';
import { RestaurantsInput, RestaurantsOutput } from './dtos/restaurants.dto';

@Resolver(() => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation(() => CreateRestaurantOutput)
  @Role('Owner')
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantService.createRestaurant(
      authUser,
      createRestaurantInput,
    );
  }

  @Mutation(() => EditRestaurantOutput)
  @Role('Owner')
  async EditRestaurant(
    @AuthUser() owner: User,
    @Args('input') editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    return this.restaurantService.editRestaurant(owner, editRestaurantInput);
  }

  @Mutation(() => DeleteRestaurantOutput)
  @Role('Any')
  async deleteRestaurant(
    @AuthUser() owner: User,
    @Args('input') deleteRestaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    console.log(owner);
    return this.restaurantService.deleteRestaurant(
      owner,
      deleteRestaurantInput,
    );
  }

  @Query(() => RestaurantsOutput)
  async allRestaurants(
    @Args('input') restaurantsInput: RestaurantsInput,
  ): Promise<RestaurantsOutput> {
    return this.restaurantService.allRestaurants(restaurantsInput);
  }

  @Query(() => RestaurantOutput)
  async findRestaurant(
    @Args('input') restaurantInput: RestaurantInput,
  ): Promise<RestaurantOutput> {
    return this.restaurantService.findRestaurant(restaurantInput);
  }

  @Query(() => SearchRestaurantOutput)
  async searchRestaurant(
    @Args('input') searchRestaurantInput: SearchRestaurantInput,
  ): Promise<SearchRestaurantOutput> {
    return this.restaurantService.searchRestaurantByName(searchRestaurantInput);
  }
}
