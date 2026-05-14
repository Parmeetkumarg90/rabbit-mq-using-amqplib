import { Injectable } from "@nestjs/common";
import { ProductCreationDto } from "src/features/common/dto/product.dto";
import ProductEntity from "src/features/common/entity/product-entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export default class ProductRepository extends Repository<ProductEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(ProductEntity, dataSource.createEntityManager());
    }

    async createProduct(payload: ProductCreationDto) {
        const product = this.create({
            product_name: payload.product_name
        });
        return await this.save(product);
    }
}