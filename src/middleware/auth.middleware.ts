import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

import * as dotenv from 'dotenv';
import { decode } from "punycode";
dotenv.config();

const jwt = require('jsonwebtoken');

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {

    const auth = req.headers['authorization'];
    if (auth) {
      const token = auth.split(' ')[1]

      jwt.verify(token, process.env.JWTSecret, (err, decoded) => {
        if (err) {
          throw new HttpException('Invalidated Token', HttpStatus.UNAUTHORIZED);
        } else {
          res.locals.token = token;
          res.locals.loggedUser = { id: decoded.id, email: decoded.email };
          next();
        }
      });
    } else {
      throw new HttpException('Invalidated Token', HttpStatus.UNAUTHORIZED);
    }

  }
}