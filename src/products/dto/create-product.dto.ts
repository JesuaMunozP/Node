import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, 
         IsPositive, IsString, MinLength 
} from 'class-validator';


export class CreateProductDto {

    @ApiProperty({
        description: 'product title (unique)',
        nullable: false,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        description: 'product price)',
        nullable: true
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({
        description: 'product description)',
        nullable: true
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'product slug (unique))',
        nullable: false
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        description: 'product stock)',
        nullable: false,
        default: 0
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        description: 'product sizes',
        nullable: true
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    sizes?: string[]

    @ApiProperty({
        description: 'product gender (men,women,kid,unisex)',
        nullable: true
    })
    @IsIn(['men','women','kid','unisex'])
    @IsOptional()
    gender?: string;

    @ApiProperty({
        description: 'product tags (summer,women,green)',
        nullable: true
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags?: string[];

    @ApiProperty({
        description: 'product images urls',
        nullable: true
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];


}
