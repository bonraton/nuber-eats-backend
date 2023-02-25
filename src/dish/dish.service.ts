import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateDishInput, CreateDishOutput } from './dtos/create-dish.dto';
import { DeleteDishInput } from './dtos/delete-dish.dto';
import { EditDishInput, EditDishOutput } from './dtos/edit-dish.dto';
import { Dish } from './entities/dish.entity';

export class DishService {
  constructor(
    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}

  async createDish(
    owner: User,
    createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    try {
      const restaurant = await this.restaurants.findOne({
        where: { id: createDishInput.restaurantId },
      });
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant is not found',
        };
      }
      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: "You can't create dish",
        };
      }
      await this.dishes.save(
        this.dishes.create({ ...createDishInput, restaurant }),
      );
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: 'Could not create Dish',
      };
    }
  }

  async deleteDish(owner: User, { dishId }: DeleteDishInput) {
    try {
      const dish = await this.dishes.findOne({
        where: { id: dishId },
        relations: ['restaurant'],
      });
      if (!dish) {
        return {
          ok: false,
          error: 'Dish is not found',
        };
      }
      if (dish.restaurant.ownerId !== owner.id) {
        return {
          ok: false,
          error: "You cand edit menu you don't own",
        };
      }
      await this.dishes.delete(dishId);
      return {
        ok: false,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: 'Could not delete dish',
      };
    }
  }

  async editDish(
    owner: User,
    editDishInput: EditDishInput,
  ): Promise<EditDishOutput> {
    const dish = await this.dishes.findOne({
      where: { id: editDishInput.dishId },
      relations: ['restaurant'],
    });
    if (!dish) {
      return {
        ok: false,
        error: 'Dish is not found',
      };
    }
    if (dish.restaurant.ownerId !== owner.id) {
      return {
        ok: false,
        error: "You can't edit menu",
      };
    }
    await this.dishes.save([
      {
        id: editDishInput.dishId,
        ...editDishInput,
      },
    ]);
    return {
      ok: true,
    };
  }
}
