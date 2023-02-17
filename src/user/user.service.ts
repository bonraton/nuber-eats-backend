import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './entities/dtos/create-account.dto';
import { User } from './entities/user.entity';
import { LoginInput, LoginOutput } from './entities/dtos/login.dto';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { JwtService } from 'src/jwt/jwt.service';
import {
  EditProfileInput,
  EditProfileOutput,
} from './entities/dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';
import { MailService } from 'src/mail/mail.service';
import {
  UserProfileInput,
  UserProfileOutput,
} from './entities/dtos/user-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
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
      const verification = await this.verifications.save(
        this.verifications.create({
          user,
        }),
      );
      this.mailService.sendVerificationEmail(user.email, verification.code);
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

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOneOrFail({ where: { id } });
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return { ok: false, error: 'User is Not Found' };
    }
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.users.findOne({ where: { id: userId } });
      if (email) {
        user.email = email;
        user.verified = false;
        const verification = await this.verifications.save(
          this.verifications.create({ user }),
        );
        this.mailService.sendVerificationEmail(user.email, verification.code);
      }
      if (password) {
        user.password = password;
      }
      await this.users.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error: 'Could not update profile' };
    }
  }

  async verifyEmail(code: string): Promise<boolean> {
    const verification = await this.verifications.findOne({
      where: { code },
      loadRelationIds: true,
    });
    if (verification) {
      verification.user.verified = true;
      await this.users.save(verification.user);
      await this.verifications.delete(verification.id);
    }
    return false;
  }
}
