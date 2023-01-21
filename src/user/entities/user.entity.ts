import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/etities/core.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';

type UserRole = 'client' | 'owner' | 'delivery';

@ObjectType()
@Entity()
export class User extends CoreEntity {
  @PrimaryColumn()
  @Field(() => Number)
  id: number;

  @Column()
  @Field(() => String)
  email: string;

  @Field(() => String)
  @Column()
  password: string;

  @Column()
  role: UserRole;
}
