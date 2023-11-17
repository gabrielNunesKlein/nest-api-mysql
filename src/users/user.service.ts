import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { CreateDTO } from "./dto/create-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import * as bcrypt from "bcrypt"
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from "./entity/user.entity";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>
        
        ) { }

    
    async create({ email, name, password, role}: CreateDTO) {

        try {

            if(await this.usersRepository.exist({
                where: { email }
            })){
                throw new BadRequestException('E-mail já existe.')
            }

            password = await bcrypt.hash(password, await bcrypt.genSalt());

            const user = this.usersRepository.create({
                email,
                name,
                password,
                role
            })
    
            return await this.usersRepository.save(user);
        } catch(err){
            return err
        }

        /*
        return await this.prisma.user.create({
            data: {
                email,
                name,
                password,
                role
            },
            /*
            select: {
                id: true,
                name: true
            }
        });*/
    }

    async list(){
        //return this.prisma.user.findMany();
        return this.usersRepository.find();
    }

    async show(id: number){

        if(!await this.usersRepository.exist({
            where: {
                id
            }
        })){
            throw new NotFoundException('Id invalid.')
        }

        return this.usersRepository.findOneBy({
            id
        })
    }

    async update(id: number, { email, name, password, role}: UpdatePutUserDTO){

        if(!await this.show(id)){
            throw new NotFoundException('Não foi encontrado o usuário com id: ' + id);
        }

        password = await bcrypt.hash(password, await bcrypt.genSalt());

        await this.usersRepository.update(id, {
            email,
            password,
            role,
            name
        });

        return this.show(id);
    }

    async updatePartial(id: number, data: UpdatePatchUserDTO){
        
        if(!await this.show(id)){
            throw new NotFoundException('Não foi encontrado o usuário com id: ' + id);
        }

        if(data.password){
            data.password = await bcrypt.hash(data.password, await bcrypt.genSalt());
        }

        await this.usersRepository.update(id, {
            email: data.email,
            password: data.password,
            name: data.name,
            role: data.role
        })

        return this.show(id);
    }

    async delete(id: number){

        if(!await this.show(id)){
            throw new NotFoundException('Não foi encontrado o usuário com id: ' + id);
        }

        await this.usersRepository.delete(id);

        return {
            message: `User com id: ${id} foi deletado`
        }
    }

    

}