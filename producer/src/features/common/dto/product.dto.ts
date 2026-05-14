import { IsString, Length } from "class-validator";

export class ProductCreationDto {
    @IsString()
    @Length(1)
    product_name: string;
}