import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { Category } from './entities/category.entity';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @ResolveField(() => Number)
  restaurantCount(@Parent() category: Category): Promise<number> {
    return this.categoryService.countRestaurants(category);
  }

  @Query(() => AllCategoriesOutput)
  allCategories(): Promise<AllCategoriesOutput> {
    return this.categoryService.allCategories();
  }
}
