import { Command } from "@nestjs/cqrs";

export default class ProductCommand extends Command<{ product_name: string; }> {
    constructor(public readonly product_name: string) {
        super();
    }
}