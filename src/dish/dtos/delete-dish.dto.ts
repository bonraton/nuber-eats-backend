import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Dish } from '../entities/dish.entity';

@InputType()
export class DeleteDishInput extends PickType(Dish, ['id']) {
  @Field(() => Number)
  restaurantId: number;
}

@ObjectType()
export class DeleteDishOutput extends CoreOutput {}
