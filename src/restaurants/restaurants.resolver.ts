import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { createRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Resolver(() => Restaurant) // Schema type
export class RestorauntResolver {
  @Query(() => [Restaurant]) // function, return type
  restaurants(@Args('veganOnly') veganOnly: boolean): Restaurant[] {
    return [];
  }
  @Mutation(() => Boolean)
  createRestaurant(@Args('input') createRestaurantDto: createRestaurantDto) {
    return true;
  }
}
