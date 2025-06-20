import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { throwError } from 'rxjs';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepo: Repository<ProductEntity>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = await this.productRepo.save(createProductDto);
      return product;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllProducts() {
    try {
      const products = await this.productRepo.find();
      return products;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async GetProductById(id: string) {
    try {
      const product = await this.productRepo.findOne({ where: { id } });
      if (!product) {
        throw new NotFoundException(`Product with ${id} not found`);
      }
      return product;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateProductById(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ${id} not found`);
    }
    const updatedProduct = await this.productRepo.save({
      ...product,
      ...updateProductDto,
    });
    return updatedProduct;
  }

  async deleteProductById(id: string){
    try{
      const product = await this.productRepo.findOne({ where: { id } });
      if (!product) {
        throw new NotFoundException(`Product with ${id} not found`);
      }
      await this.productRepo.remove(product)
      return { message: `Product with ID ${id} deleted successfully` };
      
    }catch(error){
      throw new InternalServerErrorException(error.message)
    }
  }
}
