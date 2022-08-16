import { Product } from './';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';


@Entity({ name: 'product_images' })
export class ProductImage {

    @ApiProperty({
        example: '11111111',
        description: 'Image ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        example: '1740507-00-A_0_2000.jpg',
        description: 'Image URL',
        uniqueItems: true
    })
    @Column('text',{
        default: ''
    })
    url: string;

    @ManyToOne(
        () => Product,
        ( product ) => product.images,
        {  onDelete: 'CASCADE' }
    )
    product: Product

}