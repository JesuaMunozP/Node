import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Product } from '../entities/product.entity';
import { ProductsService } from "../products.service";
import { ProductImage } from '../entities/product-image.entity';
import { Connection, DataSource, QueryRunner, Repository } from "typeorm";
import { CreateProductDto } from "../dto/create-product.dto";
import { InternalServerErrorException } from "@nestjs/common";
import { PaginationDto } from '../../common/dtos/pagination.dto';

describe('ProductService', () => {
let service: ProductsService;
let productImage: Repository<ProductImage>;

const mockProductRepository = {
    create: jest.fn().mockImplementation( dto => dto ),
    save: jest.fn().mockImplementation( product => Promise.resolve({ id: Date.now(), ...product })),
    findOneBy: jest.fn().mockImplementation( product => Promise.resolve({ id : Date.now()})),
    findOne: jest.fn().mockImplementation( product => Promise.resolve({ id : Date.now()})),
    update: jest.fn().mockImplementation( product => Promise.resolve({ id : '033ae036-6a20-4760-a11c-f83667474085', ...product})),
    find: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder : jest.fn(),
    createQueryRunner: jest.fn(),
   // update: jest.fn(),
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

           // mockProductRepository.save.mockReturnValue(product);
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

    describe('When search All Products', () => {
        it('should be list of all products', async () => {
            const paginationDto = {
                limit: 1,
                offset: 1,
            }

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
            mockProductRepository.find.mockReturnValue([product, product]);
            const products = await service.findAll(paginationDto);
            expect(products).toHaveLength(2);
        });
      });

      describe('When delete a product', () => {
        it('Should delete a existing product', async () => {
            const productDelete = {
                id: '033ae036-6a20-4760-a11c-f83667474085',
                title: 'title',
                price: 200,
                description: 'description',
                slug: 'slug',
                stock: 10,
                sizes: ['s','m'],
                gender: 'gender',
                tags: [],
                images: ['1','2','3'],
            }

            mockProductRepository.findOne.mockReturnValue(productDelete);
            const productDeleted = await service.remove(productDelete.id);

            expect(mockProductRepository.findOne).toBeDefined();
        });
      });

    it('Should update a user', async () => {

       /* const product = {
            id: '033ae036-6a20-4760-a11c-f83667474085',
            title: 'title',
            price: 200,
            description: 'description',
            slug: 'slug',
            stock: 10,
            sizes: ['s','m'],
            gender: 'gender',
            tags: [],
            images: ['1','2','3'],
        }*/
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

        const productUpdate = {
            title: 'titleUpdate'
        }

        mockProductRepository.preload.mockReturnValue(product);
        mockProductRepository.update.mockReturnValue({
            ...product,
            ...productUpdate,
        });

        mockProductRepository.create.mockReturnValue({
            ...product,
            ...productUpdate,
        })

         const resultProduct = await service.update('033ae036-6a20-4760-a11c-f83667474085', {
            ...product,
            title: 'titleUpdate',
        });

    });

    it('should expect an error trying to update a product', async () => {
        await service.update('033ae036-6a20-4760-a11c-f83667474085',{ title : 'Test'}).catch(e => {
            expect(e);
        });
    });
});