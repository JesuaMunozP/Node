import { Test, TestingModule } from "@nestjs/testing";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { Product } from './entities/product.entity';

describe('ProductsController', () => {
    let controller: ProductsController;

    const mockProductService = {
        create: jest.fn( dto => {
            return {
                id: '1',
                ...dto
            }
        }),
        update: jest.fn((id, dto) => ({
            id,
            ...dto
        })),
        findOnePlain: jest.fn(id => {
            return {
                id: '1',
                title: 'Product Name'
            }
        }),
        findAll: jest.fn( dto => {
            let prod1 = { 
                id: 1,
                title: '1'
            }

            let prod2 = { 
                id: 2,
                title: '2'
            }
            return {
                prod1, prod2
            }
        }),

    };

    beforeEach( async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductsController],
            providers: [ProductsService],
        }).overrideProvider(ProductsService).useValue(mockProductService).compile();

        controller = module.get<ProductsController>(ProductsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined;
    });

    it('should create a new product', () => {
        expect(controller.create({ title: "Relaxed T Logo Hat" })).toEqual({
            id: '1',
            title: "Relaxed T Logo Hat",
        });
    });

    it('should update a product', () => {
        const dto = { title: 'Product Name'};
        expect(controller.update('2', dto  )).toEqual({
            id: '2',
            ...dto,
        });
    });

    it('should find one product', () => {
        expect(controller.findOne( 'Product Name' )).toEqual({
            id: '1',
            title: "Product Name"
        });
    });

    it('should get all products', () => {
        let prod1 = { 
            id: 1,
            title: '1'
        }

        let prod2 = { 
            id: 2,
            title: '2'
        }
        const pagDto = {
            limit: 2,
            offset: 1
        }
        expect(controller.findAll(pagDto)).toEqual({
           prod1, prod2
        });;
    });

});
