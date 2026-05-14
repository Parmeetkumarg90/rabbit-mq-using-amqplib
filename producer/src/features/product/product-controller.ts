import { Body, Controller, Post } from "@nestjs/common";
import ProductService from "./product-service";
import { ProductCreationDto } from "../common/dto/product.dto";

@Controller('product')
export default class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    async createProduct(@Body() payload: ProductCreationDto) {
        return await this.productService.createProduct(payload);
    }
}