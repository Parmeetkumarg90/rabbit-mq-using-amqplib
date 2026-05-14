import { Module } from "@nestjs/common";
import ProductController from "./product-controller";
import ProductService from "./product-service";
import { CqrsModule } from "@nestjs/cqrs";
import ProductHandler from "./product-handler";
import ProductRepository from "src/infrastructure/database/repository/product.repository";
import OutboxRepository from "src/infrastructure/database/repository/outbox.repository";

@Module({
    imports: [CqrsModule.forRoot()],
    controllers: [ProductController],
    providers: [ProductService, ProductHandler, ProductRepository, OutboxRepository]
})
export default class ProductModule { };