import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Product } from './entities/product.entity';
import { ProductsService } from "./products.service";
import { ProductImage } from './entities/product-image.entity';
import { Repository } from "typeorm";

describe('ProductService', () => {
let service: ProductsService;
let productImage: Repository<ProductImage>;

const mockProductRepository = {
    create: jest.fn().mockImplementation( dto => dto ),
    save: jest.fn().mockImplementation( product => Promise.resolve({ id: Date.now(), ...product }))
};

const mockProductImageRepository = {

};

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: getRepositoryToken(Product),
                    useValue: mockProductRepository,
                },
                {
                    provide: getRepositoryToken(ProductImage),
                    useValue: mockProductRepository,
                },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        productImage = module.get<Repository<ProductImage>>(getRepositoryToken(ProductImage));
    });

    it('should be defined', () =>{
        expect(service).toBeDefined();
    });

   /* it('should create a new product and return', async () => {
        expect(await service.create({title : 'Test', images: ['1','2']})).toEqual({
            id: expect.any(Number),
            title : 'Test',
            images: ['1','2']
        });
    });*/
});
