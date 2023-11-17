import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEYS } from 'src/decoretors/roles.decoretor';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(private readonly reflector: Reflector
        ){ }

    async canActivate(context: ExecutionContext){
        
        const requiriRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEYS, [context.getHandler(), context.getClass()])

        if(!requiriRoles){
            return true;
        }


        const { user } = context.switchToHttp().getRequest();

        const roleFilter = requiriRoles.filter(role => role === user.role)

        return roleFilter.length > 0;

    }

}