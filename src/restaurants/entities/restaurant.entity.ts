import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

@ObjectType()
@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  @IsNumber()
  id: number;

  // query name
  @Field(() => String)
  @Column() // query field must be a function, return type
  @IsString()
  name: string; // field type like

  @Field(() => Boolean, { defaultValue: true }) // default value to graphql
  @Column({ default: true }) //default value to db
  @IsBoolean()
  @IsOptional()
  isVegan?: boolean;

  @Field(() => String)
  @Column()
  @IsString()
  adress: string;

  @Field(() => String)
  @Column()
  @IsString()
  ownerName: string;

  @Field(() => String)
  @Column()
  @IsString()
  categoryName: string;
}
