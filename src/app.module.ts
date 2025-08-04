import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './modules/roles/roles.module';
import { CustomersModule } from './modules/customers/customers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/data-source';
import { JwtService } from '@nestjs/jwt';
import { LoggingMiddleware } from './comman/middlewares/middleware.logging';

@Module({
  imports: [
    RolesModule, 
    CustomersModule,
    TypeOrmModule.forRoot(typeOrmConfig),
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
  exports: [JwtService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
