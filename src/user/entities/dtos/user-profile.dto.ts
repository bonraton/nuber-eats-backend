import { ArgsType, Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../user.entity';

@ArgsType()
export class UserProfileInput {
  @Field(() => Number)
  userId: number;
}

@InputType()
export class UserProfileOutput extends CoreOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}
