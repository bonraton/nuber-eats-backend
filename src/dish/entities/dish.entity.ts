import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/etities/core.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { IsNumber, IsString, Length } from 'class-validator';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';

@InputType('dishOptionInputType')
@ObjectType()
class DishOption {
  @Field(() => String)
  name: string;

  @Field(() => [DishChoise], { nullable: true })
  choises?: DishChoise[];

  @Field(() => Number, { nullable: true })
  extra?: number[];
}

@InputType('DishChoiseInputType')
@ObjectType()
class DishChoise {
  @Field(() => String)
  name: string;
  @Field(() => Number, { nullable: true })
  extra?: number;
}

@InputType('dishInputType')
@ObjectType()
@Entity()
export class Dish extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  name: string;

  @Field(() => Number)
  @Column()
  @IsNumber()
  price: number;

  @Field(() => String, { nullable: true })
  @Column()
  @IsString()
  photo?: string;

  @Field(() => String)
  @Column()
  @IsString()
  @Length(5, 140)
  description: string;

  @Field(() => Restaurant)
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menu, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @RelationId((dish: Dish) => dish.restaurant)
  restaurantId: number;

  @Field(() => [DishOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: DishOption[];
}
