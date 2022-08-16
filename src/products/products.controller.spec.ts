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
        }))
    };

    beforeEach( async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductsController],
            providers: [ProductsService],
        }).overrideProvider(ProductsService).useValue(mockProductService).compile();

        controller = module.get<ProductsController>(ProductsController);
    });

    it('should create a new product', () => {
        expect(controller.create({
            title: "Product Name",
            sizes: [],
            gender: "",
            tags: []
        })).toEqual({
            id: '1',
            title: "Product Name",
            sizes: [],
            gender: "",
            tags: []
        });
    });

    it('should update a product', () => {
        const dto = { title: 'Product Name'};
        expect(controller.update('2', dto  )).toEqual({
            id: '2',
            ...dto,
        });
    });

});
