import { InputType, OmitType } from '@nestjs/graphql';
import { Restaurant } from '../entities/restaurant.entity';

@InputType() // ArgsType allows to use arguments separetlly
export class createRestaurantDto extends OmitType(
  Restaurant,
  ['id'],
  InputType,
) {}
