import { BadRequestException, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request } from "express";
import { Response } from "supertest";

export class UserIdCheckMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {

       
        if(isNaN(Number(req.params.id)) || Number(req.params.id) <= 0){
            throw new BadRequestException('ID inválido');
        }

        next();
    }

}