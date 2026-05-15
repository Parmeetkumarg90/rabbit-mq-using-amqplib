import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import ProductEntity from '../../../features/common/entity/product-entity';
import { ProductCreationDto } from '../../../features/common/dto/product.dto';

@Injectable()
export default class ProductRepository extends Repository<ProductEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ProductEntity, dataSource.createEntityManager());
  }

  async createProduct(payload: ProductCreationDto) {
    const product = this.create({
      product_name: payload.product_name,
    });
    return await this.save(product);
  }
}
