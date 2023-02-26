import {
  Field,
  Float,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/etities/core.entity';
import { Dish } from 'src/dish/entities/dish.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';

export enum OrderStatus {
  Pending = 'Pending',
  Cooking = 'Cooking',
  PickedUp = 'PickedUp',
  Delivered = 'Deliveres',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@InputType('orderInputType')
@ObjectType()
@Entity()
export class Order extends CoreEntity {
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'SET NULL' })
  customer?: User;

  @Field(() => User, { nullable: true })
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.rides, { onDelete: 'SET NULL' })
  driver?: User;

  @Field(() => Restaurant)
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders, {
    onDelete: 'SET NULL',
  })
  restaurant: Restaurant;

  @Field(() => [Dish])
  @ManyToMany(() => Dish)
  @JoinColumn()
  dishes: Dish[];

  @Column()
  @Field(() => Float)
  total: number;

  @Column({ type: 'enum', enum: OrderStatus })
  @Field(() => OrderStatus)
  status: OrderStatus;
}
