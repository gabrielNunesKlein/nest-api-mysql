import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/users/user.module";
import { AuthService } from "./auth.service";
import { FileModule } from "src/file/file.module";
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from "src/users/entity/user.entity";

@Module({
    imports: [JwtModule.register({ 
        secret: "d6[0]Coz9nwXbFjf/iFw{w~u_4SD/1d"
    }), 
    forwardRef(() => UserModule), 
    FileModule, TypeOrmModule.forFeature([UserEntity])
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {

}