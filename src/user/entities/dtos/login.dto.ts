import { InputType, PickType, ObjectType, Field } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { User } from '../user.entity';

@InputType()
export class LoginInput extends PickType(
  User,
  ['email', 'password'],
  InputType,
) {}

@ObjectType()
export class LoginOutput extends MutationOutput {
  @Field(() => String, { nullable: true })
  token?: string;
}
