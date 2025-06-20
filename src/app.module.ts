import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './products/entities/product.entity';
import { CategoryModule } from './category/category.module';
import { categoryEntity } from './category/entities/category.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASS,
      database: process.env.PG_DB,
      synchronize: true,
      autoLoadEntities: true,
      entities: [ProductEntity, categoryEntity]
    }),
    CategoryModule,
    ProductsModule
  ],
})
export class AppModule {}
