import { Module } from '@nestjs/common';
import { RestorauntResolver } from './restaurants.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant])],
  providers: [RestorauntResolver, RestaurantService],
})
export class RestaurantsModule {}
