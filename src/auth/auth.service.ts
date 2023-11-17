import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { AuthRegisterDto } from "./dto/auth-register-dto";
import { UserService } from "src/users/user.service";
import * as bcrypt from "bcrypt"
import { MailerService } from "@nestjs-modules/mailer";
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from "src/users/entity/user.entity";

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
        private readonly JwtService: JwtService, 
        private readonly userService: UserService,
        private readonly mailService: MailerService
        ){ }

    createToken(user: UserEntity){
        
        return {
            accessToken: this.JwtService.sign({
                id: user.id,
                name: user.name,
                email: user.email
            }, {
                expiresIn: "7 days",
                subject: String(user.id),
                issuer: 'login',
                audience: 'users'
            })
        }
    }

    checkToken(token: string){
        try{
            return this.JwtService.verify(token, {
                audience: 'users',
                issuer: 'login'
            })
        } catch(err){
            return {
                err
            }
        }
    }

    isValidToken(token: string){
        try {
            this.checkToken(token);
            return true;
        }catch(err){
            return false;
        }
    }

    async login(email: string, password: string){
        const user = await this.usersRepository.findOne({
            where: {
                email,
                //password
            }
        })

        if(!user){
            throw new UnauthorizedException('login ou senha incorretos.')
        }

        if (!await bcrypt.compare(password, user.password)){
            throw new UnauthorizedException('login ou senha incorretos.')
        }

        return this.createToken(user);
    }

    async forget(email: string){
        
        const user = await this.usersRepository.findOneBy({
            email
        })

        if(!user){
            throw new UnauthorizedException('email incorretos.')
        }

        const token = this.JwtService.sign({
            id: user.id
        }, {
            expiresIn: "30 minutes",
            subject: String(user.id),
            issuer: 'forget',
            audience: 'users'
        })


        await this.mailService.sendMail({
            subject: 'Recuperação de Senha',
            to: 'Gabriel.klein@gmail.com',
            template: 'forget',
            context: {
                name: user.name,
                token
            }
        })

        return true;
    }

    async reset(password: string, token: string){

        try{
            const data: any = this.JwtService.verify(token, {
                audience: 'users',
                issuer: 'forget'
            })

            if(isNaN(Number(data.id))){
                throw new BadRequestException('Token invalid')
            }

            password = await bcrypt.hash(password, await bcrypt.genSalt());

            await this.usersRepository.update(data.id, {
                password
            })

            const user = await this.userService.show(Number(data.id))
    
            return this.createToken(user);

        } catch(err){
            return {
                err
            }
        }
    }

    async register(data: AuthRegisterDto){
        /*
        const user = await this.userService.create(data);
        return this.createToken(user);*/
    }
}