import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: '19f93b43-b1c6-4471-a582-9f5a549a9104',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Shirt',
        description: 'Product title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
    })
    title: string;

    @ApiProperty({
        example: '200.99',
        description: 'Product price',
        default: 0
    })
    @Column('float',{
        default: 0
    })
    price?: number;

    @ApiProperty({
        example: 'Shirt for mans',
        description: 'Product description',
        uniqueItems: true
    })
    @Column({
        type: 'text',
        nullable: true,
        default: ''
    })
    description?: string;

    @ApiProperty({
        example: 'Slug product',
        description: 'Product Slug',
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
        nullable: true
    })
    slug: string;

    @ApiProperty({
        example: '100',
        description: 'Product stock',
        default: 0
    })
    @Column('int', {
        default: 0,
        nullable: true
    })
    stock?: number;

    @ApiProperty({
        example: '["s","m","l"]',
        description: 'Products Sizes',
        default: []
    })
    @Column('text',{
        array: true,
        nullable: true,
        default: []
    })
    sizes?: string[];

    @ApiProperty({
        example: 'female',
        description: 'Gender',
        default: ''
    })
    @Column('text',{
        nullable: true,
        default: ''
    })
    gender?: string;

    @ApiProperty({
        example: '["summer","green"]',
        description: 'Products tags',
        default: []
    })
    @Column('text', {
        array: true,
        default: [],
        nullable: true
    })
    tags?: string[];

    // images
    @ApiProperty({
        example: '["i.jpg","2.jpg"]',
        description: 'Products images',
        default: []
    })
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];


    @BeforeInsert()
    checkSlugInsert() {

        if ( !this.slug ) {
            this.slug = this.title;
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')

    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }


}
