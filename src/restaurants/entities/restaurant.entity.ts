import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Restaurant {
  // query name
  @Field(() => String) // query field must be a function, return type
  name: string; // field type like

  @Field(() => Boolean)
  isVegan?: boolean;

  @Field(() => String)
  adress: string;

  @Field(() => String)
  ownerName: string;
}
