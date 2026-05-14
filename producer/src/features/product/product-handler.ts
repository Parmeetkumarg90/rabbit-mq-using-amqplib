import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import ProductCommand from "./product-command";
import ProductEntity from "../common/entity/product-entity";
import ProductRepository from "src/infrastructure/database/repository/product.repository";
import OutboxRepository from "src/infrastructure/database/repository/outbox.repository";

@CommandHandler(ProductCommand)
export default class ProductHandler implements ICommandHandler<ProductCommand> {
    constructor(private readonly productRepo: ProductRepository,
        private readonly outboxRepo: OutboxRepository
    ) { }

    async execute(command: ProductCommand): Promise<ProductEntity> {
        const product = await this.productRepo.createProduct(command);
        await this.outboxRepo.createEvent({ event_type: "product_create", created_at: product.createdAt });
        return product;
    }
}