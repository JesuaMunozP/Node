import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Product } from '../entities/product.entity';
import { ProductsService } from "../products.service";
import { ProductImage } from '../entities/product-image.entity';
import { DataSource, Repository } from "typeorm";
import { CreateProductDto } from "../dto/create-product.dto";
import { InternalServerErrorException } from "@nestjs/common";

describe('ProductService', () => {
let service: ProductsService;
let productImage: Repository<ProductImage>;

const mockProductRepository = {
    create: jest.fn().mockImplementation( dto => dto ),
    save: jest.fn().mockImplementation( product => Promise.resolve({ id: Date.now(), ...product })),
    findOneBy: jest.fn().mockImplementation( product => Promise.resolve({ id : Date.now()})),
    findOne: jest.fn().mockImplementation( product => Promise.resolve({ id : Date.now()})),
    remove: jest.fn().mockImplementation( product => Promise.resolve( true )),
    update: jest.fn(),
};

const mockDataSourceRepository = {
    //Aqui deberian ir las funciones de datasource. 
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
                {
                    provide: DataSource,
                    useValue: mockDataSourceRepository,
                },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        productImage = module.get<Repository<ProductImage>>(getRepositoryToken(ProductImage));
    });

    it('should be defined', () =>{
        expect(service).toBeDefined();
    });

    it('should create a new product and return', async () => {
        expect(await service.create({ title : 'Test'})).toEqual({
            images: [],
            title : 'Test',
        });
    });

    it('should return a product', async () => {
        expect(await service.findOne('033ae036-6a20-4760-a11c-f83667474085')).toEqual({
            id : expect.any(Number)
        });
    });

    describe('should create a new product and return', () => {
        it('should create a new product and return', async () => {
            const product = new CreateProductDto();
            product.title = 'title';
            product.price = 200;
            product.description = 'description';
            product.slug = 'slug';
            product.stock = 10;
            product.sizes = ['s','m'];
            product.gender = 'gender';
            product.tags = [];
            product.images = ['1','2','3'];

            mockProductRepository.save.mockReturnValue(product);
            mockProductRepository.create.mockReturnValue(product);

            const saveProduct = await service.create(product);

            expect(saveProduct).toMatchObject(product);
        });

        it('should return a exception when doesnt create a product', async () => {
            const product = new CreateProductDto();
            product.title = 'title';
            product.price = 200;
            product.description = 'description';
            product.slug = 'slug';
            product.stock = 10;
            product.sizes = ['s','m'];
            product.gender = 'gender';
            product.tags = [];
            product.images = ['1','2','3'];

            const productNull = new CreateProductDto();

            mockProductRepository.save.mockReturnValue(productNull);
            mockProductRepository.create.mockReturnValue(product);

            const saveProduct = await service.create(product);

            await service.create(productNull).catch(e => {
              expect(e).toMatchObject({
                status: 400,
              });
            });
          });
    });

    /*
    describe('When update product', () => {
        it('Should update a product', async () => {
          const product = new Product();
          product.id = '1';
          product.slug = 'slug';
          product.title = 'title';
          product.images = [];

          const updatedProduct = {
            title: 'title updated',
            slug: 'slug',
            images: [],
         };

          mockProductRepository.findOne.mockReturnValue(product)
          mockProductRepository.update.mockReturnValue({
            ...product,
            ...updatedProduct,
          });

          mockProductRepository.create.mockReturnValue({
            ...product,
            ...updatedProduct,
          })

          const resultProduct = await service.update('1', {
            title: 'title updated',
            slug: 'slug',
            images: [],
          });

          expect(resultProduct).toBeCalledTimes(1);
          expect(mockProductRepository.create).toBeCalledTimes(1);
          expect(mockProductRepository.findOne).toBeCalledTimes(1);
          expect(mockProductRepository.update).toBeCalledTimes(1);
        });
      });*/

});