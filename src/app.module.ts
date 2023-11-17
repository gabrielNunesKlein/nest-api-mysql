import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entity/user.entity';
import { ConfigModule } from '@nestjs/config';
//import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    /*
    ThrottlerModule.forRoot({
      tt: 60,
      limit: 10
  }), */
  ConfigModule.forRoot(),
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: String(process.env.DB_HOST),
    port: Number(process.env.DB_HOST),
    username: String(process.env.DB_USERNAME),
    password: String(process.env.DB_PASSWORD),
    database: String(process.env.DB_DATABASE),
    entities: [UserEntity],
    synchronize: true
  }),
  MailerModule.forRoot({
    transport:{
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'bette.stracke@ethereal.email',
          pass: 'R1wd57tSfAucfDvf9w'
      }
    }, //'smtps://bette.stracke@ethereal.email:R1wd57tSfAucfDvf9w@smtp.ethereal.email',
    defaults: {
      from: '"nest-modules" <bette.stracke@ethereal.email>',
    },
    template: {
      dir: __dirname + '/templates',
      adapter: new PugAdapter(),
      options: {
        strict: true,
      },
    },
  }),
  forwardRef(() => UserModule), forwardRef(() => AuthModule)],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService]
})
export class AppModule {}
