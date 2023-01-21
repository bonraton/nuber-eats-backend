import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { createRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';

@Resolver(() => Restaurant) // Schema type
export class RestorauntResolver {
  constructor(private readonly restaurantService: RestaurantService) {} // service injection, needs import to modules
  @Query(() => [Restaurant]) // function, return type
  restaurants(): Promise<Restaurant[]> {
    return this.restaurantService.getAll();
  }
  @Mutation(() => Boolean)
  createRestaurant(@Args('input') createRestaurantDto: createRestaurantDto) {
    return true;
  }
}
