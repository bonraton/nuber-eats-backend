import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'src/user/user.service';
import { JwtService } from './jwt.service';

// created to handle http headers

@Injectable()
export class JwtMiddleWare implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService, // private readonly userService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt']; // took header from request
      try {
        const decoded = this.jwtService.verify(token.toString()); // verified with created jwtService
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const user = await this.userService.findById(decoded['id']); // if it verified, get user with id from token
          req['user'] = user; // adding data to request object
        }
      } catch (e) {
        console.log(e);
      }
    }
    next();
  }
}
