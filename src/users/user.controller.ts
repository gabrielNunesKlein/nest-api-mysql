import { Controller, Post, Body, Get, Param, Put, Patch, Delete, ParseIntPipe, UseInterceptors, UseGuards } from "@nestjs/common";
import { CreateDTO } from "./dto/create-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import { UserService } from "./user.service";
import { LogInterceptor } from "src/interceptors/log.interceptor";
import { Roles } from "src/decoretors/roles.decoretor";
import { Role } from "src/enums/role.enum";
import { RoleGuard } from "src/guards/role.guard";
import { AuthGuard } from "src/guards/auth.guard";
//import { ParamId } from "src/decoretors/user.decoretor";

@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController { 

    constructor(private readonly userService: UserService) { }

    //@Roles(Role.Admin)
    @UseInterceptors(LogInterceptor)
    @Post()
    async create(@Body() data: CreateDTO){
        return this.userService.create(data);
    }

    //@Roles(Role.Admin, Role.User)
    @Get()
    async read(){
        return this.userService.list()
    }

    //@Roles(Role.Admin)
    @Get(':id')
    async readOne(@Param('id', ParseIntPipe) id){
        return this.userService.show(id);
    }

    //@Roles(Role.Admin)
    @Put(':id')
    async update(@Body() data: UpdatePutUserDTO, @Param('id', ParseIntPipe) id){
        return this.userService.update(id, data);
    }

    //@Roles(Role.Admin)
    @Patch(':id')
    async updatePatch(@Body() data: UpdatePatchUserDTO, @Param('id', ParseIntPipe) id){
        return this.userService.updatePartial(id, data);
    }

    //@Roles(Role.Admin)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id){
        return this.userService.delete(id);
    }

}