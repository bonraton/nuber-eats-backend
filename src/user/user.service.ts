import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './entities/dtos/create-account.dto';
import { User } from './entities/user.entity';
import { LoginInput, LoginOutput } from './entities/dtos/login.dto';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput } from './entities/dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CoreOutput> {
    try {
      const exists = await this.users.findOne({ where: { email: email } });
      if (exists) {
        return {
          ok: false,
          error: 'There is a user with a email already',
        };
      }
      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );
      const verifictaion = this.verifications.create({ user });
      await this.verifications.save(verifictaion);
      // await this.verifications.save(
      //   this.verifications.create({
      //     user,
      //   }),
      // );
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
      const token = this.jwtService.sign(user.id);
      return { ok: true, token: token };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async findById(id: number): Promise<User> {
    return this.users.findOne({ where: { id } });
  }

  async editProfile(userId: number, { email, password }: EditProfileInput) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (email) {
      user.email = email;
    }
    if (password) {
      user.password = password;
    }
    return this.users.save(user);
  }
}
