import { Module } from '@nestjs/common';
import { RestorauntResolver } from './restaurants.resolver';

@Module({
  providers: [RestorauntResolver],
})
export class RestaurantsModule {}
