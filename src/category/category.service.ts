import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Repository } from 'typeorm';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import { Category } from './entities/category.entity';

export class CategoryService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
  ) {}

  async allCategories(): Promise<AllCategoriesOutput> {
    try {
      const categories = await this.categories.find();
      return {
        ok: true,
        categories: categories,
      };
    } catch {
      return {
        ok: false,
      };
    }
  }

  countRestaurants(category: Category) {
    return this.restaurants.count({ where: { category: { id: category.id } } });
  }

  async findCategorySlug(
    categoryInput: CategoryInput,
  ): Promise<CategoryOutput> {
    try {
      const category = await this.categories.findOne({
        where: { slug: categoryInput.slug },
        relations: ['restaurants'],
      });
      console.log(category);
      if (!category) {
        return {
          ok: false,
          error: 'Category is not found',
        };
      }
      return {
        ok: true,
        category,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: 'Category is not found',
      };
    }
  }
}
