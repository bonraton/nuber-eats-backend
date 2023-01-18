import { Field, ArgsType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';

@ArgsType() // ArgsType allows to use arguments separetlly
export class createRestaurantDto {
  @Field(() => String)
  @IsString()
  @Length(5, 10)
  name: string;

  @Field(() => Boolean)
  @IsBoolean()
  isVegan: boolean;

  @Field(() => String)
  @IsString()
  adress: string;

  @Field(() => String)
  @IsString()
  @Length(5, 10)
  ownerName: string;
}
