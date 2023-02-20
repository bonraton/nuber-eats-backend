import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/common/etities/core.entity';
import { Category } from './category.entity';
import { User } from 'src/user/entities/user.entity';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  name: string;

  @Field(() => String)
  @Column()
  @IsString()
  coverImg: string;

  @Field(() => String)
  @Column()
  @IsString()
  adress: string;

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.restaurants, {
    onDelete: 'CASCADE',
  })
  owner: User;
}
