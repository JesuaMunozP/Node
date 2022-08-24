import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { ProductsService } from '../products.service';
import { ProductImage } from '../entities/product-image.entity';
import { DataSource, Repository, QueryRunner, QueryBuilder } from 'typeorm';
import { CreateProductDto } from '../dto/create-product.dto';
import { HttpException, NotFoundException } from '@nestjs/common';
import { UpdateProductDto } from '../dto/update-product.dto';

let objQuery = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    release: jest.fn(),
    delete: jest.fn(),
};

describe('ProductService', () => {
    let service: ProductsService;
    let productImage: Repository<ProductImage>;

    const mockProductRepository = {
        create: jest.fn().mockImplementation((dto) => dto),
        save: jest.fn().mockImplementation((product) => Promise.resolve({ id: Date.now(), ...product }),),
        findOneBy: jest.fn().mockImplementation((product) => Promise.resolve({ id: Date.now() })),
        // findOne: jest.fn().mockImplementation((product) => Promise.resolve({ id: Date.now() })),
        findOne: jest.fn().mockImplementation((product) => Promise.resolve(product)),
        update: jest.fn().mockImplementation((product) => Promise.resolve({ id: '033ae036-6a20-4760-a11c-f83667474085', ...product }),),
        // update: jest.fn().mockImplementation((id: '033ae036-6a20-4760-a11c-f83667474085') => {id: '033ae036-6a20-4760-a11c-f83667474085'}),
        find: jest.fn(),
        preload: jest.fn(),
        remove: jest.fn(),
        delete: jest.fn(),
        findOnePlain: jest.fn().mockImplementation((dto) => dto),
        createQueryBuilder: jest.fn(() => ({
            delete: () => jest.fn().mockReturnThis(),
            innerJoinAndSelect: () => jest.fn().mockReturnThis(),
            innerJoin: () => jest.fn().mockReturnThis(),
            leftJoinAndSelect: () => jest.fn().mockReturnThis(),
            leftJoin: () => jest.fn().mockReturnThis(),
            from: () => jest.fn().mockReturnThis(),
            where: () => jest.fn().mockReturnThis(),
            orWhere: () => jest.fn().mockReturnThis(),
            andWhere: () => jest.fn().mockReturnThis(),
            execute: () => jest.fn().mockReturnThis(),
            orderBy: () => jest.fn().mockReturnThis(),
            take: () => jest.fn().mockReturnThis(),
            skip: () => jest.fn().mockReturnThis(),
            getOne: () => jest.fn(),
            getMany: () => jest.fn(),
            getManyAndCount: () => jest.fn(),
        })),
    };


    const mockDataSourceRepository = {
        createQueryRunner: jest.fn().mockImplementation(() => objQuery),
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
        productImage = module.get<Repository<ProductImage>>(
            getRepositoryToken(ProductImage),
        );

    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('should create a new product and return', () => {
        it('create(), create a new product and return', async () => {
            expect(await service.create({ title: 'Test' })).toEqual({
                images: [],
                title: 'Test',
            });
        });

        it('create(), should return a exception when doesnt create a product', async () => {
            await expect(service.create(null)).rejects.toThrowError(
                HttpException,
            );
        });
    });

    describe('Should return a list of Products', () => {
        it('findAll(), should return a list of all products', async () => {
            const paginationDto = {
                limit: 1,
                offset: 1,
            };

            const product = new CreateProductDto();
            product.title = 'title';
            product.price = 200;
            product.description = 'description';
            product.slug = 'slug';
            product.stock = 10;
            product.sizes = ['s', 'm'];
            product.gender = 'gender';
            product.tags = [];
            product.images = ['1', '2', '3'];
            await mockProductRepository.find.mockReturnValue([product, product]);
            const products = await service.findAll(paginationDto);
            expect(products).toHaveLength(2);
        });
    });

    describe('should return a product by id', () => {
        it('findOne(), should return a product', async () => {
            expect(
                await service.findOne('033ae036-6a20-4760-a11c-f83667474085'),
            ).toEqual({
                id: expect.any(Number),
            });
        });

        it('findOne(), should return a exception when doesnt find a product', async () => {
            await service.findOne(null).catch((e) => {
                expect(e);
            });
        });
    });

    describe('Should return a product', () => {
        it('findOnePlain() should return a product', async () => {
            expect(await service.findOnePlain('033ae036-6a20-4760-a11c-f83667474085')).toEqual({
                id: expect.any(Number),
                images: [],
            });
        });
    });

    describe('Update a product', () => {
        it('update(), should return a product', async () => {
            const whereSpy = jest.fn().mockReturnThis();
            const mockRepository = jest.fn(() => ({
                createQueryBuilder: jest.fn(() => ({
                  where: whereSpy,
                })),
              }));

            const imageProductUpdate = {
                id: '1',
                url: '1',
                product: '033ae036-6a20-4760-a11c-f83667474085'
            };

            const product = {
                id: '033ae036-6a20-4760-a11c-f83667474085',
                title: 'title',
                price: 200,
                description: 'description',
                slug: 'slug',
                stock: 10,
                sizes: ['s', 'm'],
                gender: 'gender',
                tags: [],
                images: ['1'],
            };
    
              mockProductRepository.create.mockReturnValue(product);
              mockProductRepository.create.mockReturnValue(imageProductUpdate);
              const saveProduct = await service.create(product);
              mockProductRepository.find.mockReturnValue(product);
        });
        it('update(), should update a product', async () => {
            const product = new CreateProductDto();
            product.title = 'title';
            product.slug = 'slug';
            product.images = ['1', '2', '3'];

            const productUpdate = {
                images: ['1', '2', '3', '4'],
            };

            await mockProductRepository.preload.mockReturnValue(product);

            await mockProductRepository.update.mockReturnValue({
                ...product,
                ...productUpdate,
            });

            await mockProductRepository.create.mockReturnValue({
                ...product,
                ...productUpdate,
            });
        });

        it('update(), should expect an error trying to update a product', async () => {
            await service.update('033ae036-6a20-4760-a11c-f83667474085', { title: 'Test'}).catch((e) => {
                expect(e);
            });
        });

        it('update(), should delete the images when update a product', async () => {
            await service.update('033ae036-6a20-4760-a11c-f83667474085', {
                 images: ['1', '2', '3']}).catch((e) => {
                expect(e);
            });
        });
    });

    describe('Should delete a product', () => {
        it('remove(), should delete a existing product', async () => {
            const productDelete = {
                id: '033ae036-6a20-4760-a11c-f83667474085',
                title: 'title',
                price: 200,
                description: 'description',
                slug: 'slug',
                stock: 10,
                sizes: ['s', 'm'],
                gender: 'gender',
                tags: [],
                images: ['1', '2', '3'],
            };

            await mockProductRepository.findOne.mockReturnValue(productDelete);
            const productDeleted = await service.remove(productDelete.id);
            expect(await mockProductRepository.findOne).toBeDefined();
        });
    });
});