import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './entities/dtos/create-account.dto';
import { User } from './entities/user.entity';
import { LoginInput, LoginOutput } from './entities/dtos/login.dto';
import { MutationOutput } from 'src/common/dtos/output.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<MutationOutput> {
    try {
      const exists = await this.users.findOne({ where: { email: email } });
      if (exists) {
        return {
          ok: false,
          error: 'There is a user with a email already',
        };
      }
      await this.users.save(this.users.create({ email, password, role }));
      return { ok: true };
    } catch (e) {
      console.log(e);
      return { ok: false, error: "Couldn't create account" };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({ where: { email } });
      if (!user) {
        return { ok: false, error: 'User is not found' };
      }
      const correctPassword = await user.CheckPassword(password);
      if (!correctPassword) {
        return { ok: false, error: 'Wrong password' };
      }
      return { ok: true, token: 'alallalal' };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
