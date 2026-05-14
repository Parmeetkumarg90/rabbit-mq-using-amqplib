import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ProductModule from './features/product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from './infrastructure/database/database-datasource';

@Module({
  imports: [TypeOrmModule.forRoot({
    ...dataSource.options,
    retryDelay: 3000,
    retryAttempts: 1000
  }), ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }