import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { DishResolver } from './dish.resolver';
import { DishService } from './dish.service';
import { Dish } from './entities/dish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dish, Restaurant])],
  providers: [DishResolver, DishService],
})
export class DishModule {}
