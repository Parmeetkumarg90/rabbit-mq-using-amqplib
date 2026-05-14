import { Injectable } from "@nestjs/common";
import { ProductCreationDto } from "../common/dto/product.dto";
import { CommandBus } from "@nestjs/cqrs";
import ProductCommand from "./product-command";

@Injectable()
export default class ProductService {
    constructor(private readonly commandBus: CommandBus) { }

    async createProduct(payload: ProductCreationDto) {
        try {
            const command = new ProductCommand(payload.product_name);
            const product = await this.commandBus.execute(command);
            console.log(product);
            return {
                message: "Product Created Successfully",
                product
            }
        }
        catch (e) {
            console.log("Error in product creation: ", e);
            return {
                message: "Error in product creation",
                product: null,
            }
        }
    }
}