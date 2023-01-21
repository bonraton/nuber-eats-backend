import { InputType, PartialType, ArgsType, Field } from '@nestjs/graphql';
import { createRestaurantDto } from './create-restaurant.dto';

@InputType() // ArgsType allows to use arguments separetlly
export class UpdateRestaurantInputType extends PartialType(
  createRestaurantDto,
) {}

@ArgsType()
export class UpdateRestaurantDto {
  @Field(() => Number)
  id: number;

  @Field(() => UpdateRestaurantInputType)
  data: UpdateRestaurantInputType;
}
