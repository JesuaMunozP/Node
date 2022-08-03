import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly ProductsService: ProductsService
  ){}

  async runSeed(){

    await this.insertNewproducts();
    return 'SEED EXECUTED';
  }

  private async insertNewproducts(){
    await this.ProductsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach(  product => {
      insertPromises.push(this.ProductsService.create( product ));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
