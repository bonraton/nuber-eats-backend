import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class RestaurantsInput {
  @Field(() => Number)
  page: number;
}

@ObjectType()
export class RestaurantsOutput extends CoreOutput {
  @Field(() => [Restaurant], { nullable: true })
  restaurants?: Restaurant[];

  @Field(() => Number, { nullable: true })
  totalResults?: number;

  @Field(() => Number, { nullable: true })
  totalPages?: number;
}
