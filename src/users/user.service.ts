import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateDTO } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import * as bcrypt from "bcrypt"

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) { }

    
    async create({ email, name, password, role}: CreateDTO) {

        password = await bcrypt.hash(password, await bcrypt.genSalt());
        
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
            }*/
        });
    }

    async list(){
        return this.prisma.user.findMany();
    }

    async show(id: number){

        if(!await this.prisma.user.count({
            where: {
                id
            }
        })){
            throw new NotFoundException('Id invalid.')
        }

        return this.prisma.user.findUnique({
            where: {
                id
            }
        })
    }

    async update(id: number, data: UpdatePutUserDTO){

        if(!await this.show(id)){
            throw new NotFoundException('Não foi encontrado o usuário com id: ' + id);
        }

        data.password = await bcrypt.hash(data.password, await bcrypt.genSalt());

        return this.prisma.user.update({
            data,
            where: {
                id
            }
        })
    }

    async updatePartial(id: number, data: UpdatePatchUserDTO){
        
        if(!await this.show(id)){
            throw new NotFoundException('Não foi encontrado o usuário com id: ' + id);
        }

        if(data.password){
            data.password = await bcrypt.hash(data.password, await bcrypt.genSalt());
        }

        return this.prisma.user.update({
            data,
            where: {
                id
            }
        })
    }

    async delete(id: number){

        if(!await this.show(id)){
            throw new NotFoundException('Não foi encontrado o usuário com id: ' + id);
        }

        return this.prisma.user.delete({
            where: {
                id
            }
        })
    }

    

}